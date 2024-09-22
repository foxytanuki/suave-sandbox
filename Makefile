VERSION := $(shell git describe --tags --always --dirty="-dev")

.PHONY: clean
clean:
	rm -rf out/

.PHONY: test
test:
	go test ./framework/...

.PHONY: lint
lint:
	gofmt -d -s src/go/ framework/
	gofumpt -d -extra src/go/ framework/
	go vet ./src/go/... ./framework/...
	staticcheck ./src/go/... ./framework/...
	golangci-lint run

.PHONY: fmt
fmt:
	gofmt -s -w src/go/ framework/
	gofumpt -extra -w src/go/ framework/
	gci write src/go/ framework/
	go mod tidy

.PHONY: lt
lt: lint test

.PHONY: devnet-up
devnet-up:
	@docker compose --file ./docker-compose.yaml up --detach

.PHONY: devnet-down
devnet-down:
	@docker compose --file ./docker-compose.yaml down
