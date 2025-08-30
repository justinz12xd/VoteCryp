//go:build legacy_ignore
// +build legacy_ignore

package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"io"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type User struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Password string `json:"-"`
	Wallet   Wallet `json:"wallet"`
}

type Wallet struct {
	Address    string `json:"address"`
	PrivEncB64 string `json:"privEncB64"`
}

// simple in-memory store (replace with DB in prod)
var users = map[string]User{}

func jwtSecret() []byte {
	s := os.Getenv("JWT_SECRET")
	if s == "" {
		s = "dev_secret"
	}
	return []byte(s)
}
func aesKey() []byte {
	k := os.Getenv("AES_KEY")
	if len(k) == 0 {
		k = "0123456789abcdef0123456789abcdef"
	}
	return []byte(k)
}

func makeJWT(userID string) (string, error) {
	claims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString(jwtSecret())
}

func parseJWT(tokenStr string) (string, error) {
	t, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) { return jwtSecret(), nil })
	if err != nil || !t.Valid {
		return "", errors.New("invalid token")
	}
	if claims, ok := t.Claims.(jwt.MapClaims); ok {
		if sub, ok := claims["sub"].(string); ok {
			return sub, nil
		}
	}
	return "", errors.New("invalid claims")
}

func AuthMiddleware(c *fiber.Ctx) error {
	auth := c.Get("Authorization")
	if len(auth) < 8 {
		return c.Status(401).JSON(fiber.Map{"error": "missing bearer"})
	}
	token := auth[len("Bearer "):]
	uid, err := parseJWT(token)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
	}
	c.Locals("userID", uid)
	return c.Next()
}

// AES-GCM helpers
func encryptAES(plaintext []byte) (string, error) {
	block, err := aes.NewCipher(aesKey())
	if err != nil {
		return "", err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}
	ciphertext := gcm.Seal(nonce, nonce, plaintext, nil)
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

func decryptAES(b64 string) ([]byte, error) {
	data, err := base64.StdEncoding.DecodeString(b64)
	if err != nil {
		return nil, err
	}
	block, err := aes.NewCipher(aesKey())
	if err != nil {
		return nil, err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	ns := gcm.NonceSize()
	if len(data) < ns {
		return nil, errors.New("ciphertext too short")
	}
	nonce, ct := data[:ns], data[ns:]
	return gcm.Open(nil, nonce, ct, nil)
}
