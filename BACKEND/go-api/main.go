package main

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	app := fiber.New()
	app.Use(recover.New())
	app.Use(logger.New())

	// Health
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"ok": true, "ts": time.Now().UTC()})
	})

	// API routes
	registerRoutes(app)

	port := os.Getenv("PORT")
	if port == "" { port = "8080" }
	log.Printf("Go API listening on :%s", port)
	log.Fatal(app.Listen(":" + port))
}
