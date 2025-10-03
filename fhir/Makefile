# =============================================================================
# NHS Notify – FHIR Letter Printing IG  —  Makefile
# Place this file at the FHIR PROJECT ROOT (same level as the /tools folder)
# =============================================================================

SHELL := /bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.RECIPEPREFIX := >

IG_DIR         ?= .
OUT_DIR        := $(IG_DIR)/output
DOCS_DIR        := $(IG_DIR)/docs

# =============================================================================
# Help
# =============================================================================
.PHONY: help
help:
	echo ""
	echo "NHS Notify – FHIR IG (Make targets)"
	echo "-----------------------------------"
	echo "make build      # run SUSHI + IG Publisher (one-shot)"
	echo "make serve      # serve ./fhir/output on http://localhost:8080"
	echo "make clean      # remove build artefacts"
	echo "make help       # show this help message"
	echo ""

# =============================================================================
# Build (SUSHI + IG Publisher)
# =============================================================================
.PHONY: build
build:
	./tools/build.sh

# =============================================================================
# Serve output locally
# =============================================================================
.PHONY: serve
serve:
	echo "▶ Serving $(OUT_DIR) on http://localhost:8080 (Ctrl+C to stop)…"
	cd $(OUT_DIR)
	python3 -m http.server 8080

# =============================================================================
# Serve docs output locally
# =============================================================================
.PHONY: serve
serve-docs:
	echo "▶ Serving $(DOCS_DIR) on http://localhost:8080 (Ctrl+C to stop)…"
	cd $(DOCS_DIR)
	python3 -m http.server 8080

# =============================================================================
# Clean build artefacts
# =============================================================================
.PHONY: clean
clean:
	echo "▶ Cleaning build artefacts…"
	./tools/clean.sh
	echo "OK"

# =============================================================================
# Generate OpenAPI (derived from CapabilityStatement + OperationDefinitions)
# =============================================================================
.PHONY: openapi
openapi:
	echo "▶ Generating OpenAPI spec…"
	./fhirtools/generate-openapi.sh
	echo "OK (see openapi/letters-api.yaml)"

# =============================================================================
# Swagger UI server (Docker) for OpenAPI spec
# =============================================================================
.PHONY: swagger-docker-build
swagger-docker-build:
	if ! command -v docker >/dev/null 2>&1; then \
		echo "✖ docker command not found in this environment"; \
		echo "  (You can still run the server locally with 'make swagger-serve')"; \
		exit 1; \
	fi
	echo "▶ Building Swagger UI Docker image (context=repo root, Dockerfile=swagger-server/Dockerfile)..."
	docker build -f swagger-server/Dockerfile -t letters-openapi:latest .
	echo "OK (image: letters-openapi:latest)"

.PHONY: swagger-docker-run
swagger-docker-run:
	if ! command -v docker >/dev/null 2>&1; then \
		echo "✖ docker command not found in this environment"; \
		echo "  (You can still run the server locally with 'make swagger-serve')"; \
		exit 1; \
	fi
	echo "▶ Running Swagger UI container on http://localhost:9090/docs ..."
	docker run --rm --init -p 9090:8080 --name letters-openapi letters-openapi:latest

.PHONY: swagger-docker-run-detach
swagger-docker-run-detach:
	docker run -d --init --rm -p 9090:8080 --name letters-openapi letters-openapi:latest
	echo "Container started (name=letters-openapi). Use 'make swagger-docker-stop' to stop."

.PHONY: swagger-docker-stop
swagger-docker-stop:
	docker stop letters-openapi || true

.PHONY: swagger-docker-shell
swagger-docker-shell:
	docker run --rm -it letters-openapi:latest sh

.PHONY: swagger-install
swagger-install:
	cd swagger-server && if [ ! -d node_modules ]; then npm ci; else echo "(node_modules already present)"; fi

.PHONY: swagger-serve
swagger-serve: swagger-install
	echo "▶ Starting Swagger UI server (no Docker) on http://localhost:8081/docs ..."
	PORT=8081 node swagger-server/src/server.js
