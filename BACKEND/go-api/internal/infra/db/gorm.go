package db

import (
    "fmt"
    "os"
    "path/filepath"
    "votcryp/backend/internal/config"
    "votcryp/backend/internal/domain"

    "github.com/glebarez/sqlite"
    "gorm.io/gorm"
    "gorm.io/gorm/logger"
)

func Open(cfg config.Config) (*gorm.DB, error) {
    // ensure directory exists
    if dir := filepath.Dir(cfg.DBPath); dir != "." && dir != "" {
        if err := os.MkdirAll(dir, 0o755); err != nil {
            return nil, fmt.Errorf("mkdir db dir: %w", err)
        }
    }
    gcfg := &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)}
    db, err := gorm.Open(sqlite.Open(cfg.DBPath+"?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)"), gcfg)
    if err != nil { return nil, err }
    if err := db.AutoMigrate(&domain.User{}, &domain.VoteIndex{}); err != nil { return nil, err }
    return db, nil
}
