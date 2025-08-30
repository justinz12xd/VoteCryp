package repository

import (
    "votcryp/backend/internal/domain"
    "gorm.io/gorm"
)

type VoteIndexGormRepo struct { db *gorm.DB }

func NewVoteIndexGormRepo(db *gorm.DB) *VoteIndexGormRepo { return &VoteIndexGormRepo{db: db} }

func (r *VoteIndexGormRepo) MarkVoted(userID, electionID string) error {
    v := &domain.VoteIndex{UserID: userID, ElectionID: electionID}
    return r.db.FirstOrCreate(v, "user_id = ? AND election_id = ?", userID, electionID).Error
}

func (r *VoteIndexGormRepo) HasVoted(userID, electionID string) (bool, error) {
    var count int64
    if err := r.db.Model(&domain.VoteIndex{}).Where("user_id = ? AND election_id = ?", userID, electionID).Count(&count).Error; err != nil {
        return false, err
    }
    return count > 0, nil
}
