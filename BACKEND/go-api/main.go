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

	log.Printf("Go API listening on :%s", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}
