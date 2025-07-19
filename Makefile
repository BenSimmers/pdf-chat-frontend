# Utility commands
.PHONY: help clean clean-all

# Development commands
.PHONY: install run watch

# Build and deployment commands
.PHONY: build preview start

# Testing and CI commands
.PHONY: lint test ci


help: ## Print info about all commands
	@echo "Helper Commands:"
	@echo
	@echo "make [TARGET]"
	@echo
	@grep -E '^[a-zA-Z0-9_-]+:.*?# .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?# "}; {printf "    \033[01;32m%-20s\033[0m %s\n", $$1, $$2}'


install: # Ensure dependencies are installed
	npm install

run: # Start the development server
	npm run dev

build: install # Build the project
	npm run build

lint: install # Lint the codebase
	npm run lint

lint-fix: install # Lint and fix the codebase
	npm run lint -- --fix

preview: build # Preview the production build
	npm run preview

clean: # Clean the build artifacts
	rm -rf dist

check: lint build # Run all checks (lint + build)

prettier: # Run Prettier to format the code
	npx prettier --write .

default: dev # Alias for 'dev' (start the development server)

clean-all:
	rm -rf dist node_modules package-lock.json

version: # Print the version of the project
	@grep '"version"' package.json | awk -F '["]' '{print $$4}' | xargs echo "Version: "