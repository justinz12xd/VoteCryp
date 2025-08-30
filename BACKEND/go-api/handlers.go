//go:build legacy_ignore
// +build legacy_ignore

package main

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/ethereum/go-ethereum/crypto"
	"github.com/gofiber/fiber/v2"
)

const (
	errInvalidBody = "invalid body"
	errUnknownUser = "unknown user"
)

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SubmitVoteRequest struct {
	ElectionID   string `json:"electionId"`
	CandidateIdx int    `json:"candidateIndex"`
}

type RegisterENSRequest struct {
	EnsName string `json:"ensName"`
}

// simple in-memory double-vote prevention: userID -> electionId -> bool
var voteIndex = map[string]map[string]bool{}

// small helpers to reduce complexity
func resolveServiceURL(baseEnv, legacyEnv, defaultURL, path string) string {
	base := os.Getenv(baseEnv)
	if base != "" {
		return fmt.Sprintf("%s/%s", strings.TrimRight(base, "/"), strings.TrimLeft(path, "/"))
	}
	u := os.Getenv(legacyEnv)
	if u != "" {
		return u
	}
	return defaultURL
}

func jsonStringsArrayFromInterfaces(list []interface{}) string {
	if len(list) == 0 {
		return "[]"
	}
	b := strings.Builder{}
	b.WriteString("[")
	for i, v := range list {
		if i > 0 {
			b.WriteString(",")
		}
		b.WriteString(fmt.Sprintf("\"%v\"", v))
	}
	b.WriteString("]")
	return b.String()
}

func RegisterHandler(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": errInvalidBody})
	}
	if req.Email == "" || req.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "missing fields"})
	}

	if _, ok := users[req.Email]; ok {
		return c.Status(409).JSON(fiber.Map{"error": "user exists"})
	}

	// generate Ethereum wallet (secp256k1)
	ecdsaPriv, err := crypto.GenerateKey()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "wallet gen failed"})
	}
	address := crypto.PubkeyToAddress(ecdsaPriv.PublicKey).Hex()
	privBytes := crypto.FromECDSA(ecdsaPriv)
	encPriv, err := encryptAES(privBytes)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "encrypt failed"})
	}

	u := User{ID: req.Email, Email: req.Email, Password: req.Password, Wallet: Wallet{Address: address, PrivEncB64: encPriv}}
	users[req.Email] = u
	if err := SaveUser(u); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "persist failed"})
	}

	jwt, err := makeJWT(u.ID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "jwt failed"})
	}
	return c.JSON(fiber.Map{"user": fiber.Map{"id": u.ID, "email": u.Email, "wallet": u.Wallet}, "token": jwt})
}

func LoginHandler(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": errInvalidBody})
	}
	u, ok := users[req.Email]
	if !ok || u.Password != req.Password {
		return c.Status(401).JSON(fiber.Map{"error": "invalid credentials"})
	}
	jwt, err := makeJWT(u.ID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "jwt failed"})
	}
	return c.JSON(fiber.Map{"token": jwt, "user": fiber.Map{"id": u.ID, "email": u.Email, "wallet": u.Wallet}})
}

func SubmitVoteHandler(c *fiber.Ctx) error {
	var req SubmitVoteRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": errInvalidBody})
	}
	uid := c.Locals("userID").(string)
	u, ok := users[uid]
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": errUnknownUser})
	}

	// double-vote check
	if voteIndex[uid] == nil {
		voteIndex[uid] = map[string]bool{}
	}
	if voteIndex[uid][req.ElectionID] {
		return c.Status(409).JSON(fiber.Map{"error": "already voted"})
	}
	if has, err := HasVoted(uid, req.ElectionID); err == nil && has {
		return c.Status(409).JSON(fiber.Map{"error": "already voted"})
	}

	// 0) ensure ENS verified for the wallet
	ensURLBase := resolveServiceURL("BLOCKCHAIN_SERVICE_URL", "BLOCKCHAIN_GET_ENS_URL", "http://localhost:4002/getENSVoter", "getENSVoter")
	ensURL := fmt.Sprintf("%s?address=%s", strings.TrimRight(ensURLBase, "/"), url.QueryEscape(u.Wallet.Address))
	if ensData, status, err := httpJSONGet(ensURL); err == nil && status == 200 {
		if v, ok := ensData["isVerified"].(bool); !ok || !v {
			return c.Status(412).JSON(fiber.Map{"error": "ens not verified", "hint": "call /api/register-ens first"})
		}
	}

	// 1) encrypt vote via encryption microservice
	encryptURL := resolveServiceURL("ENCRYPTION_SERVICE_URL", "ENCRYPTION_URL", "http://localhost:4001/encryptVote", "encryptVote")
	payload := fmt.Sprintf(`{"candidateIndex": %d, "electionId":"%s"}`, req.CandidateIdx, req.ElectionID)
	encResp, status, err := httpJSONPost(encryptURL, []byte(payload))
	if err != nil || status != 200 {
		return c.Status(502).JSON(fiber.Map{"error": "encryption failed"})
	}
	encryptedVote := encResp["encryptedVote"].(string)

	// 2) submit to blockchain microservice
	blockURL := resolveServiceURL("BLOCKCHAIN_SERVICE_URL", "BLOCKCHAIN_URL", "http://localhost:4002/submitVote", "submitVote")
	payload2 := fmt.Sprintf(`{"electionId":"%s","encryptedVote":"%s","walletAddress":"%s"}`, req.ElectionID, encryptedVote, u.Wallet.Address)
	bcResp, status, err := httpJSONPost(blockURL, []byte(payload2))
	if err != nil || status != 200 {
		return c.Status(502).JSON(fiber.Map{"error": "blockchain submit failed"})
	}

	// mark as voted
	voteIndex[uid][req.ElectionID] = true
	_ = MarkVoted(uid, req.ElectionID)

	return c.JSON(fiber.Map{"ok": true, "tx": bcResp})
}

func GetResultsHandler(c *fiber.Ctx) error {
	// 1) fetch encrypted results from blockchain service
	blockURL := resolveServiceURL("BLOCKCHAIN_SERVICE_URL", "BLOCKCHAIN_RESULTS_URL", "http://localhost:4002/getEncryptedResults", "getEncryptedResults")
	bcData, status, err := httpJSONGet(blockURL)
	if err != nil || status != 200 {
		return c.Status(502).JSON(fiber.Map{"error": "blockchain fetch failed"})
	}
	encList, _ := bcData["encryptedResults"].([]interface{})

	// 2) tally/decrypt via results service
	resultsURL := resolveServiceURL("RESULTS_SERVICE_URL", "RESULTS_URL", "http://localhost:4003/decryptResults", "decryptResults")
	// convert to []string JSON
	arr := jsonStringsArrayFromInterfaces(encList)
	payload := []byte(fmt.Sprintf(`{"encryptedResults": %s}`, arr))
	resData, status, err := httpJSONPost(resultsURL, payload)
	if err != nil || status != 200 {
		return c.Status(502).JSON(fiber.Map{"error": "results failed"})
	}

	return c.JSON(resData)
}

// Proxy to blockchain-service /registerENS
func RegisterENSHandler(c *fiber.Ctx) error {
	var req RegisterENSRequest
	if err := c.BodyParser(&req); err != nil || strings.TrimSpace(req.EnsName) == "" {
		return c.Status(400).JSON(fiber.Map{"error": errInvalidBody})
	}

	// Use user's wallet to register ENS on-chain
	uid := c.Locals("userID").(string)
	u, ok := users[uid]
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": errUnknownUser})
	}
	// decrypt user's private key
	privBytes, err := decryptAES(u.Wallet.PrivEncB64)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "wallet decrypt failed"})
	}
	// hex string with 0x prefix
	privHex := "0x" + fmt.Sprintf("%x", privBytes)

	blockBase := os.Getenv("BLOCKCHAIN_SERVICE_URL")
	url := ""
	if blockBase != "" {
		url = fmt.Sprintf("%s/registerENSWithPK", strings.TrimRight(blockBase, "/"))
	} else {
		url = os.Getenv("BLOCKCHAIN_URL")
		if url == "" {
			url = "http://localhost:4002/registerENSWithPK"
		}
	}
	payload := []byte(fmt.Sprintf(`{"ensName":"%s","privateKey":"%s"}`, req.EnsName, privHex))
	data, status, err := httpJSONPost(url, payload)
	if err != nil || status != 200 {
		return c.Status(502).JSON(fiber.Map{"error": "register ens failed"})
	}
	return c.JSON(data)
}

// GET /api/me -> returns authenticated user info plus ENS status from blockchain-service
func MeHandler(c *fiber.Ctx) error {
	uid := c.Locals("userID").(string)
	u, ok := users[uid]
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": errUnknownUser})
	}

	// fetch ENS info from blockchain-service via dedicated endpoint
	base := resolveServiceURL("BLOCKCHAIN_SERVICE_URL", "BLOCKCHAIN_GET_ENS_URL", "http://localhost:4002/getENSVoter", "getENSVoter")
	full := fmt.Sprintf("%s?address=%s", strings.TrimRight(base, "/"), url.QueryEscape(u.Wallet.Address))
	ensResp, status, err := httpJSONGet(full)
	if err != nil || status != 200 {
		// still return user data; ens unknown
		return c.JSON(fiber.Map{"user": fiber.Map{"id": u.ID, "email": u.Email, "wallet": u.Wallet}})
	}
	return c.JSON(fiber.Map{
		"user": fiber.Map{"id": u.ID, "email": u.Email, "wallet": u.Wallet},
		"ens":  ensResp,
	})
}
