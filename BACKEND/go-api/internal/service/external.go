package service

import (
	"fmt"
	"net/url"
	"strings"
	"votcryp/backend/internal/config"
	"votcryp/backend/internal/util/httpjson"
)

type ExternalServices struct {
	cfg config.Config
}

func NewExternalServices(cfg config.Config) *ExternalServices { return &ExternalServices{cfg: cfg} }

func (s *ExternalServices) GetENSVoter(address string) (map[string]interface{}, int, error) {
	base := strings.TrimRight(s.cfg.BlockchainServiceURL, "/") + "/getENSVoter"
	full := fmt.Sprintf("%s?address=%s", base, url.QueryEscape(address))
	return httpjson.Get(full)
}

func (s *ExternalServices) EncryptVote(candidateIdx int, electionID string) (map[string]interface{}, int, error) {
	url := strings.TrimRight(s.cfg.EncryptionServiceURL, "/") + "/encryptVote"
	body := []byte(fmt.Sprintf(`{"candidateIndex": %d, "electionId":"%s"}`, candidateIdx, electionID))
	return httpjson.Post(url, body)
}

func (s *ExternalServices) SubmitVote(address, encryptedVote, electionID string) (map[string]interface{}, int, error) {
	url := strings.TrimRight(s.cfg.BlockchainServiceURL, "/") + "/submitVote"
	body := []byte(fmt.Sprintf(`{"electionId":"%s","encryptedVote":"%s","walletAddress":"%s"}`, electionID, encryptedVote, address))
	return httpjson.Post(url, body)
}

func (s *ExternalServices) GetEncryptedResults() (map[string]interface{}, int, error) {
	url := strings.TrimRight(s.cfg.BlockchainServiceURL, "/") + "/getEncryptedResults"
	return httpjson.Get(url)
}

func (s *ExternalServices) DecryptResults(enc []string) (map[string]interface{}, int, error) {
	url := strings.TrimRight(s.cfg.ResultsServiceURL, "/") + "/decryptResults"
	// simple marshal to string array JSON
	b := strings.Builder{}
	b.WriteString("[")
	for i, v := range enc {
		if i > 0 {
			b.WriteString(",")
		}
		b.WriteString(fmt.Sprintf("\"%s\"", v))
	}
	b.WriteString("]")
	body := []byte(fmt.Sprintf(`{"encryptedResults": %s}`, b.String()))
	return httpjson.Post(url, body)
}

func (s *ExternalServices) RegisterENSWithPK(ensName, privHex string) (map[string]interface{}, int, error) {
	url := strings.TrimRight(s.cfg.BlockchainServiceURL, "/") + "/registerENSWithPK"
	body := []byte(fmt.Sprintf(`{"ensName":"%s","privateKey":"%s"}`, ensName, privHex))
	return httpjson.Post(url, body)
}
