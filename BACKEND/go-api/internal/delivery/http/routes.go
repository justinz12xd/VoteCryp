package http

import (
	"fmt"
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

	app.Get("/openapi.json", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"openapi": "3.0.3", "info": fiber.Map{"title": "Go API (Orchestrator)", "version": "1.0.0"}, "paths": fiber.Map{
			"/health":           fiber.Map{"get": fiber.Map{"summary": "Health", "responses": fiber.Map{"200": fiber.Map{"description": "OK"}}}},
			"/api/register":     fiber.Map{"post": fiber.Map{"summary": "Register a user", "responses": fiber.Map{"200": fiber.Map{"description": "OK"}}}},
			"/api/login":        fiber.Map{"post": fiber.Map{"summary": "Login and get JWT", "responses": fiber.Map{"200": fiber.Map{"description": "OK"}}}},
			"/api/register-ens": fiber.Map{"post": fiber.Map{"summary": "Proxy ENS registration", "responses": fiber.Map{"200": fiber.Map{"description": "OK"}}}},
			"/api/me":           fiber.Map{"get": fiber.Map{"summary": "Get current user + ENS info", "responses": fiber.Map{"200": fiber.Map{"description": "OK"}}}},
			"/api/submitVote":   fiber.Map{"post": fiber.Map{"summary": "Encrypt + submit vote", "responses": fiber.Map{"200": fiber.Map{"description": "OK"}}}},
			"/api/results":      fiber.Map{"get": fiber.Map{"summary": "Get tallied results", "responses": fiber.Map{"200": fiber.Map{"description": "OK"}}}},
		}})
	})
	app.Get("/docs", func(c *fiber.Ctx) error {
		html := `<!doctype html><html><head><meta charset="utf-8" /><title>Go API Docs</title><link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" /></head><body><div id="swagger-ui"></div><script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script><script>window.ui = SwaggerUIBundle({ url: '/openapi.json', dom_id: '#swagger-ui' });</script></body></html>`
		c.Type("html")
		return c.SendString(html)
	})

	_ = fmt.Sprintf("") // silence unused imports in some editors
}
