package repository

import (
    "errors"
    "votcryp/backend/internal/domain"
    "gorm.io/gorm"
)

type UserGormRepo struct { db *gorm.DB }

func NewUserGormRepo(db *gorm.DB) *UserGormRepo { return &UserGormRepo{db: db} }

func (r *UserGormRepo) Create(u *domain.User) error { return r.db.Create(u).Error }

func (r *UserGormRepo) GetByEmail(email string) (*domain.User, error) {
    var u domain.User
    err := r.db.Where("email = ?", email).First(&u).Error
    if errors.Is(err, gorm.ErrRecordNotFound) { return nil, nil }
    return &u, err
}

func (r *UserGormRepo) GetByID(id string) (*domain.User, error) {
    var u domain.User
    err := r.db.First(&u, "id = ?", id).Error
    if errors.Is(err, gorm.ErrRecordNotFound) { return nil, nil }
    return &u, err
}

func (r *UserGormRepo) Save(u *domain.User) error { return r.db.Save(u).Error }
