package usecase

import (
    "errors"
    "github.com/ethereum/go-ethereum/crypto"
    "votcryp/backend/internal/config"
    "votcryp/backend/internal/domain"
    "votcryp/backend/internal/util/cryptohelper"
)

type AuthUseCase struct {
    cfg   config.Config
    users domain.UserRepository
}

func NewAuthUseCase(cfg config.Config, users domain.UserRepository) *AuthUseCase {
    return &AuthUseCase{cfg: cfg, users: users}
}

func (u *AuthUseCase) Register(email, password string) (*domain.User, error) {
    if email == "" || password == "" { return nil, errors.New("missing fields") }
    if existing, _ := u.users.GetByEmail(email); existing != nil {
        return nil, errors.New("user exists")
    }
    ecdsaPriv, err := crypto.GenerateKey()
    if err != nil { return nil, err }
    address := crypto.PubkeyToAddress(ecdsaPriv.PublicKey).Hex()
    privBytes := crypto.FromECDSA(ecdsaPriv)
    enc, err := cryptohelper.EncryptAES(u.cfg.AESKey, privBytes)
    if err != nil { return nil, err }
    user := &domain.User{ID: email, Email: email, Password: password, WalletAddress: address, WalletPrivEnc: enc}
    if err := u.users.Create(user); err != nil { return nil, err }
    return user, nil
}

func (u *AuthUseCase) Login(email, password string) (*domain.User, error) {
    usr, err := u.users.GetByEmail(email)
    if err != nil || usr == nil { return nil, errors.New("invalid credentials") }
    if usr.Password != password { return nil, errors.New("invalid credentials") }
    return usr, nil
}
