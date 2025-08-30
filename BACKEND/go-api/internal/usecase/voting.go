package usecase

import (
	"errors"
	"fmt"
	"votcryp/backend/internal/config"
	"votcryp/backend/internal/domain"
	"votcryp/backend/internal/service"
	"votcryp/backend/internal/util/cryptohelper"
)

type VotingUseCase struct {
	cfg   config.Config
	users domain.UserRepository
	votes domain.VoteIndexRepository
	ext   *service.ExternalServices
}

func NewVotingUseCase(cfg config.Config, users domain.UserRepository, votes domain.VoteIndexRepository, ext *service.ExternalServices) *VotingUseCase {
	return &VotingUseCase{cfg: cfg, users: users, votes: votes, ext: ext}
}

func (u *VotingUseCase) SubmitVote(userID, electionID string, candidateIdx int) (map[string]interface{}, error) {
	usr, err := u.users.GetByID(userID)
	if err != nil || usr == nil {
		return nil, errors.New("unknown user")
	}

	if has, err := u.votes.HasVoted(userID, electionID); err == nil && has {
		return nil, errors.New("already voted")
	}

	// ENS check
	if data, status, err := u.ext.GetENSVoter(usr.WalletAddress); err == nil && status == 200 {
		if v, ok := data["isVerified"].(bool); !ok || !v {
			return nil, errors.New("ens not verified")
		}
	}

	encResp, status, err := u.ext.EncryptVote(candidateIdx, electionID)
	if err != nil || status != 200 {
		return nil, errors.New("encryption failed")
	}
	encVote, _ := encResp["encryptedVote"].(string)
	bcResp, status, err := u.ext.SubmitVote(usr.WalletAddress, encVote, electionID)
	if err != nil || status != 200 {
		return nil, errors.New("blockchain submit failed")
	}

	_ = u.votes.MarkVoted(userID, electionID)
	return bcResp, nil
}

func (u *VotingUseCase) RegisterENS(userID, ensName string) (map[string]interface{}, error) {
	usr, err := u.users.GetByID(userID)
	if err != nil || usr == nil {
		return nil, errors.New("unknown user")
	}
	privBytes, err := cryptohelper.DecryptAES(u.cfg.AESKey, usr.WalletPrivEnc)
	if err != nil {
		return nil, errors.New("wallet decrypt failed")
	}
	privHex := fmt.Sprintf("0x%x", privBytes)
	resp, status, err := u.ext.RegisterENSWithPK(ensName, privHex)
	if err != nil || status != 200 {
		return nil, errors.New("register ens failed")
	}
	return resp, nil
}

func (u *VotingUseCase) GetResults() (map[string]interface{}, error) {
	bcData, status, err := u.ext.GetEncryptedResults()
	if err != nil || status != 200 {
		return nil, errors.New("blockchain fetch failed")
	}
	list, ok := bcData["encryptedResults"].([]interface{})
	if !ok {
		return nil, errors.New("bad results format")
	}
	arr := make([]string, 0, len(list))
	for _, v := range list {
		if s, ok := v.(string); ok {
			arr = append(arr, s)
		}
	}
	res, status, err := u.ext.DecryptResults(arr)
	if err != nil || status != 200 {
		return nil, errors.New("results failed")
	}
	return res, nil
}
