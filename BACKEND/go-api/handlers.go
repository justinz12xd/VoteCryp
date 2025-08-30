package main

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"os"

	"github.com/gofiber/fiber/v2"
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
	ElectionID    string `json:"electionId"`
	CandidateIdx  int    `json:"candidateIndex"`
}

func RegisterHandler(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil { return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error":"invalid body"}) }
	if req.Email == "" || req.Password == "" { return c.Status(400).JSON(fiber.Map{"error":"missing fields"}) }

	if _, ok := users[req.Email]; ok { return c.Status(409).JSON(fiber.Map{"error":"user exists"}) }

	// generate wallet (ed25519 as placeholder)
	pub, priv, err := ed25519.GenerateKey(rand.Reader)
	if err != nil { return c.Status(500).JSON(fiber.Map{"error":"wallet gen failed"}) }
	addr := hex.EncodeToString(pub[:20])
	encPriv, err := encryptAES(priv)
	if err != nil { return c.Status(500).JSON(fiber.Map{"error":"encrypt failed"}) }

	u := User{ID: req.Email, Email: req.Email, Password: req.Password, Wallet: Wallet{Address: addr, PrivEncB64: encPriv}}
	users[req.Email] = u

	jwt, err := makeJWT(u.ID); if err != nil { return c.Status(500).JSON(fiber.Map{"error":"jwt failed"}) }
	return c.JSON(fiber.Map{"user": fiber.Map{"id": u.ID, "email": u.Email, "wallet": u.Wallet}, "token": jwt})
}

func LoginHandler(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil { return c.Status(400).JSON(fiber.Map{"error":"invalid body"}) }
	u, ok := users[req.Email]
	if !ok || u.Password != req.Password { return c.Status(401).JSON(fiber.Map{"error":"invalid credentials"}) }
	jwt, err := makeJWT(u.ID); if err != nil { return c.Status(500).JSON(fiber.Map{"error":"jwt failed"}) }
	return c.JSON(fiber.Map{"token": jwt, "user": fiber.Map{"id": u.ID, "email": u.Email, "wallet": u.Wallet}})
}

func SubmitVoteHandler(c *fiber.Ctx) error {
	var req SubmitVoteRequest
	if err := c.BodyParser(&req); err != nil { return c.Status(400).JSON(fiber.Map{"error":"invalid body"}) }
	uid := c.Locals("userID").(string)
	u, ok := users[uid]; if !ok { return c.Status(401).JSON(fiber.Map{"error":"unknown user"}) }

	// 1) encrypt vote via encryption microservice
	encryptURL := os.Getenv("ENCRYPTION_URL"); if encryptURL == "" { encryptURL = "http://localhost:4001/encryptVote" }
	payload := fmt.Sprintf(`{"candidateIndex": %d, "electionId":"%s"}`, req.CandidateIdx, req.ElectionID)
	encResp, status, err := httpJSONPost(encryptURL, []byte(payload))
	if err != nil || status != 200 { return c.Status(502).JSON(fiber.Map{"error":"encryption failed"}) }
	encryptedVote := encResp["encryptedVote"].(string)

	// 2) submit to blockchain microservice
	blockURL := os.Getenv("BLOCKCHAIN_URL"); if blockURL == "" { blockURL = "http://localhost:4002/submitVote" }
	payload2 := fmt.Sprintf(`{"electionId":"%s","encryptedVote":"%s","walletAddress":"%s"}`, req.ElectionID, encryptedVote, u.Wallet.Address)
	bcResp, status, err := httpJSONPost(blockURL, []byte(payload2))
	if err != nil || status != 200 { return c.Status(502).JSON(fiber.Map{"error":"blockchain submit failed"}) }

	return c.JSON(fiber.Map{"ok": true, "tx": bcResp})
}

func GetResultsHandler(c *fiber.Ctx) error {
	// 1) fetch encrypted results from blockchain service
	blockURL := os.Getenv("BLOCKCHAIN_RESULTS_URL"); if blockURL == "" { blockURL = "http://localhost:4002/getEncryptedResults" }
	bcData, status, err := httpJSONGet(blockURL)
	if err != nil || status != 200 { return c.Status(502).JSON(fiber.Map{"error":"blockchain fetch failed"}) }
	encList, _ := bcData["encryptedResults"].([]interface{})

	// 2) tally/decrypt via results service
	resultsURL := os.Getenv("RESULTS_URL"); if resultsURL == "" { resultsURL = "http://localhost:4003/decryptResults" }
	// convert to []string JSON
	arr := "["
	for i, v := range encList { if i>0 { arr += "," }; arr += fmt.Sprintf("\"%v\"", v) }
	arr += "]"
	payload := []byte(fmt.Sprintf(`{"encryptedResults": %s}`, arr))
	resData, status, err := httpJSONPost(resultsURL, payload)
	if err != nil || status != 200 { return c.Status(502).JSON(fiber.Map{"error":"results failed"}) }

	return c.JSON(resData)
}
