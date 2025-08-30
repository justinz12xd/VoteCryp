# syntax=docker/dockerfile:1
FROM golang:1.22-alpine AS builder
WORKDIR /app
# Copy module files first to leverage Docker layer caching and ensure sums are generated
COPY go.mod go.sum ./
RUN go mod download
# Now copy the rest of the source
COPY . ./
# Ensure go.sum is up to date inside the build environment before building
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./

FROM gcr.io/distroless/base-debian12:nonroot
WORKDIR /app
COPY --from=builder /app/server /app/server
ENV PORT=8080
EXPOSE 8080
USER 65532:65532
ENTRYPOINT ["/app/server"]
