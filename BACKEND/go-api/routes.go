package main

import (
	"github.com/gofiber/fiber/v2"
)

func registerRoutes(app *fiber.App) {
	api := app.Group("/api")

	api.Post("/register", RegisterHandler)
	api.Post("/login", LoginHandler)
	api.Post("/submitVote", AuthMiddleware, SubmitVoteHandler)
	api.Get("/results", AuthMiddleware, GetResultsHandler)

	// OpenAPI (static) and Swagger UI
	app.Get("/openapi.json", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"openapi": "3.0.3",
			"info":    fiber.Map{"title": "Go API (Orchestrator)", "version": "1.0.0"},
			"paths": fiber.Map{
				"/health":         fiber.Map{"get": fiber.Map{"summary": "Health", "responses": fiber.Map{"200": fiber.Map{"description": "OK"}}}},
				"/api/register":   fiber.Map{"post": fiber.Map{"summary": "Register a user", "responses": fiber.Map{"200": fiber.Map{"description": "OK"}}}},
				"/api/login":      fiber.Map{"post": fiber.Map{"summary": "Login and get JWT", "responses": fiber.Map{"200": fiber.Map{"description": "OK"}}}},
				"/api/submitVote": fiber.Map{"post": fiber.Map{"summary": "Encrypt + submit vote", "responses": fiber.Map{"200": fiber.Map{"description": "OK"}}}},
				"/api/results":    fiber.Map{"get": fiber.Map{"summary": "Get tallied results", "responses": fiber.Map{"200": fiber.Map{"description": "OK"}}}},
			},
		})
	})
	app.Get("/docs", func(c *fiber.Ctx) error {
		html := `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Go API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
	<div id="swagger-ui"></div>
	<script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
	<script>window.ui = SwaggerUIBundle({ url: '/openapi.json', dom_id: '#swagger-ui' });</script>
  </body>
</html>`
		c.Type("html")
		return c.SendString(html)
	})
}
