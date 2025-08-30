package http

import (
	"votcryp/backend/internal/config"
	"votcryp/backend/internal/domain"
	"votcryp/backend/internal/service"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(app *fiber.App, cfg config.Config, h *Handlers, jwt *JWT, users domain.UserRepository, ext *service.ExternalServices) {
	api := app.Group("/api")
	api.Post("/register", h.Register)
	api.Post("/login", h.Login)
	api.Post("/register-ens", jwt.Middleware, h.RegisterENS)
	api.Post("/submitVote", jwt.Middleware, h.SubmitVote)
	api.Get("/results", jwt.Middleware, h.Results)

	api.Get("/me", jwt.Middleware, func(c *fiber.Ctx) error {
		uid := c.Locals("userID").(string)
		u, _ := users.GetByID(uid)
		if u == nil {
			return c.Status(401).JSON(fiber.Map{"error": "unknown user"})
		}
		ens, _, _ := ext.GetENSVoter(u.WalletAddress)
		return c.JSON(fiber.Map{
			"user": fiber.Map{"id": u.ID, "email": u.Email, "wallet": fiber.Map{"address": u.WalletAddress}},
			"ens":  ens,
		})
	})
}
