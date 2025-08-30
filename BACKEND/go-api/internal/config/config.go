package config

import (
	"os"
)

type Config struct {
	Port                 string
	DBPath               string
	JWTSecret            string
	AESKey               string
	BlockchainServiceURL string
	EncryptionServiceURL string
	ResultsServiceURL    string
}

func getenv(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func Load() Config {
	return Config{
		Port:                 getenv("PORT", "8080"),
		DBPath:               getenv("DB_PATH", "/tmp/go-api.db"),
		JWTSecret:            getenv("JWT_SECRET", "dev_secret"),
		AESKey:               getenv("AES_KEY", "0123456789abcdef0123456789abcdef"),
		BlockchainServiceURL: getenv("BLOCKCHAIN_SERVICE_URL", getenv("BLOCKCHAIN_URL", "http://localhost:4002")),
		EncryptionServiceURL: getenv("ENCRYPTION_SERVICE_URL", getenv("ENCRYPTION_URL", "http://localhost:4001")),
		ResultsServiceURL:    getenv("RESULTS_SERVICE_URL", getenv("RESULTS_URL", "http://localhost:4003")),
	}
}
