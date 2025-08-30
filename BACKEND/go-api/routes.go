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
}
