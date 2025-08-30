package http

import (
	"votcryp/backend/internal/usecase"

	"github.com/gofiber/fiber/v2"
)

const (
	errInvalidBody = "invalid body"
)

type Handlers struct {
	auth   *usecase.AuthUseCase
	voting *usecase.VotingUseCase
	jwt    *JWT
}

func NewHandlers(auth *usecase.AuthUseCase, voting *usecase.VotingUseCase, jwt *JWT) *Handlers {
	return &Handlers{auth: auth, voting: voting, jwt: jwt}
}

func (h *Handlers) Register(c *fiber.Ctx) error {
	var body struct{ Email, Password string }
	if err := c.BodyParser(&body); err != nil || body.Email == "" || body.Password == "" {
		return c.Status(400).JSON(fiber.Map{"error": errInvalidBody})
	}
	u, err := h.auth.Register(body.Email, body.Password)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	tok, _ := h.jwt.Make(u.ID)
	return c.JSON(fiber.Map{"user": fiber.Map{"id": u.ID, "email": u.Email, "wallet": fiber.Map{"address": u.WalletAddress}}, "token": tok})
}

func (h *Handlers) Login(c *fiber.Ctx) error {
	var body struct{ Email, Password string }
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": errInvalidBody})
	}
	u, err := h.auth.Login(body.Email, body.Password)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "invalid credentials"})
	}
	tok, _ := h.jwt.Make(u.ID)
	return c.JSON(fiber.Map{"token": tok, "user": fiber.Map{"id": u.ID, "email": u.Email, "wallet": fiber.Map{"address": u.WalletAddress}}})
}

func (h *Handlers) SubmitVote(c *fiber.Ctx) error {
	var body struct {
		ElectionID     string
		CandidateIndex int
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": errInvalidBody})
	}
	uid := c.Locals("userID").(string)
	resp, err := h.voting.SubmitVote(uid, body.ElectionID, body.CandidateIndex)
	if err != nil {
		return c.Status(412).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"ok": true, "tx": resp})
}

func (h *Handlers) RegisterENS(c *fiber.Ctx) error {
	var body struct{ EnsName string }
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": errInvalidBody})
	}
	uid := c.Locals("userID").(string)
	resp, err := h.voting.RegisterENS(uid, body.EnsName)
	if err != nil {
		return c.Status(502).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(resp)
}

func (h *Handlers) Results(c *fiber.Ctx) error {
	res, err := h.voting.GetResults()
	if err != nil {
		return c.Status(502).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(res)
}
