package http

import (
    "errors"
    "time"
    "github.com/gofiber/fiber/v2"
    jwtlib "github.com/golang-jwt/jwt/v5"
)

type JWT struct { secret []byte }

func NewJWT(secret string) *JWT { return &JWT{secret: []byte(secret)} }

func (j *JWT) Make(userID string) (string, error) {
    claims := jwtlib.MapClaims{"sub": userID, "exp": time.Now().Add(24 * time.Hour).Unix()}
    t := jwtlib.NewWithClaims(jwtlib.SigningMethodHS256, claims)
    return t.SignedString(j.secret)
}

func (j *JWT) Parse(token string) (string, error) {
    t, err := jwtlib.Parse(token, func(token *jwtlib.Token) (interface{}, error) { return j.secret, nil })
    if err != nil || !t.Valid { return "", errors.New("invalid token") }
    if claims, ok := t.Claims.(jwtlib.MapClaims); ok {
        if sub, ok := claims["sub"].(string); ok { return sub, nil }
    }
    return "", errors.New("invalid claims")
}

func (j *JWT) Middleware(c *fiber.Ctx) error {
    auth := c.Get("Authorization")
    if len(auth) < len("Bearer ")+1 { return c.Status(401).JSON(fiber.Map{"error": "missing bearer"}) }
    uid, err := j.Parse(auth[len("Bearer "):])
    if err != nil { return c.Status(401).JSON(fiber.Map{"error": "unauthorized"}) }
    c.Locals("userID", uid)
    return c.Next()
}
