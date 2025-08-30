package main

import (
	"log"
	"time"
	"votcryp/backend/internal/config"
	delivery "votcryp/backend/internal/delivery/http"
	infraDB "votcryp/backend/internal/infra/db"
	repo "votcryp/backend/internal/infra/repository"
	"votcryp/backend/internal/service"
	"votcryp/backend/internal/usecase"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	cfg := config.Load()

	gdb, err := infraDB.Open(cfg)
	if err != nil {
		log.Fatalf("db open failed: %v", err)
	}

	users := repo.NewUserGormRepo(gdb)
	votes := repo.NewVoteIndexGormRepo(gdb)
	ext := service.NewExternalServices(cfg)

	authUC := usecase.NewAuthUseCase(cfg, users)
	voteUC := usecase.NewVotingUseCase(cfg, users, votes, ext)

	jwt := delivery.NewJWT(cfg.JWTSecret)
	h := delivery.NewHandlers(authUC, voteUC, jwt)

	app := fiber.New()
	app.Use(recover.New())
	app.Use(logger.New())

	app.Get("/health", func(c *fiber.Ctx) error { return c.JSON(fiber.Map{"ok": true, "ts": time.Now().UTC()}) })
	delivery.RegisterRoutes(app, cfg, h, jwt, users, ext)

	// Serve OpenAPI and docs
	app.Get("/openapi.yaml", func(c *fiber.Ctx) error {
		c.Type("yaml")
		return c.SendFile("internal/docs/openapi.yaml")
	})
	app.Get("/docs", func(c *fiber.Ctx) error {
		html := `<!doctype html><html><head><meta charset="utf-8" /><title>Go API Docs</title><link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" /></head><body><div id="swagger-ui"></div><script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script><script>window.ui = SwaggerUIBundle({ url: '/openapi.yaml', dom_id: '#swagger-ui' });</script></body></html>`
		c.Type("html")
		return c.SendString(html)
	})

	log.Printf("Go API listening on :%s", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}
