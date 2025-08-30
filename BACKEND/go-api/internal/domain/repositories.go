package domain

type UserRepository interface {
    Create(u *User) error
    GetByEmail(email string) (*User, error)
    GetByID(id string) (*User, error)
    Save(u *User) error
}

type VoteIndexRepository interface {
    MarkVoted(userID, electionID string) error
    HasVoted(userID, electionID string) (bool, error)
}
