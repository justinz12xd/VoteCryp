//go:build legacy_ignore
// +build legacy_ignore

package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
)

var db *sql.DB

func dbPath() string {
	p := os.Getenv("DB_PATH")
	if p == "" {
		// default to a writable path in container
		p = "/tmp/go-api.db"
	}
	return p
}

func InitDB() error {
	p := dbPath()
	// ensure directory exists
	if dir := filepath.Dir(p); dir != "." && dir != "" {
		if err := os.MkdirAll(dir, 0o755); err != nil {
			return fmt.Errorf("mkdir db dir: %w", err)
		}
	}
	// DSN with sane pragmas
	dsn := fmt.Sprintf("file:%s?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)", p)
	var err error
	db, err = sql.Open("sqlite", dsn)
	if err != nil {
		return err
	}
	return db.Ping()
}

func Migrate() error {
	stmts := []string{
		`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            wallet_address TEXT NOT NULL,
            wallet_priv_enc TEXT NOT NULL
        );`,
		`CREATE TABLE IF NOT EXISTS vote_index (
            user_id TEXT NOT NULL,
            election_id TEXT NOT NULL,
            PRIMARY KEY (user_id, election_id)
        );`,
	}
	for _, s := range stmts {
		if _, err := db.Exec(s); err != nil {
			return err
		}
	}
	return nil
}

func LoadCacheFromDB() error {
	// Users
	rows, err := db.Query(`SELECT id, email, password, wallet_address, wallet_priv_enc FROM users`)
	if err != nil {
		return err
	}
	defer rows.Close()
	for rows.Next() {
		var id, email, pass, addr, enc string
		if err := rows.Scan(&id, &email, &pass, &addr, &enc); err != nil {
			return err
		}
		users[email] = User{ID: id, Email: email, Password: pass, Wallet: Wallet{Address: addr, PrivEncB64: enc}}
	}
	if err := rows.Err(); err != nil {
		return err
	}

	// Vote index
	rows2, err := db.Query(`SELECT user_id, election_id FROM vote_index`)
	if err != nil {
		return err
	}
	defer rows2.Close()
	for rows2.Next() {
		var uid, eid string
		if err := rows2.Scan(&uid, &eid); err != nil {
			return err
		}
		if voteIndex[uid] == nil {
			voteIndex[uid] = map[string]bool{}
		}
		voteIndex[uid][eid] = true
	}
	return rows2.Err()
}

func SaveUser(u User) error {
	_, err := db.Exec(`INSERT INTO users (id, email, password, wallet_address, wallet_priv_enc)
                       VALUES (?, ?, ?, ?, ?)
                       ON CONFLICT(id) DO UPDATE SET email=excluded.email, password=excluded.password, wallet_address=excluded.wallet_address, wallet_priv_enc=excluded.wallet_priv_enc`,
		u.ID, u.Email, u.Password, u.Wallet.Address, u.Wallet.PrivEncB64,
	)
	return err
}

func MarkVoted(uid, electionID string) error {
	_, err := db.Exec(`INSERT OR IGNORE INTO vote_index (user_id, election_id) VALUES (?, ?)`, uid, electionID)
	return err
}

func HasVoted(uid, electionID string) (bool, error) {
	var count int
	err := db.QueryRow(`SELECT COUNT(1) FROM vote_index WHERE user_id=? AND election_id=?`, uid, electionID).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func MustInitDB() {
	if err := InitDB(); err != nil {
		log.Fatalf("db open failed: %v", err)
	}
	if err := Migrate(); err != nil {
		log.Fatalf("db migrate failed: %v", err)
	}
	if err := LoadCacheFromDB(); err != nil {
		log.Printf("db cache load warn: %v", err)
	}
}
