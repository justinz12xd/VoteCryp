package domain

import "time"

type User struct {
    ID            string `gorm:"primaryKey;size:255" json:"id"`
    Email         string `gorm:"uniqueIndex;size:255" json:"email"`
    Password      string `json:"-"`
    WalletAddress string `gorm:"size:255" json:"walletAddress"`
    WalletPrivEnc string `json:"-"`
    CreatedAt     time.Time
    UpdatedAt     time.Time
}

type VoteIndex struct {
    UserID     string `gorm:"primaryKey;size:255"`
    ElectionID string `gorm:"primaryKey;size:255"`
    CreatedAt  time.Time
}
