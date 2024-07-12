#Makefile variables, make code simplier
COMPOSE_FILE ?= docker-compose.dev.yaml
DOCKER_COMPOSE ?= docker-compose -f ${COMPOSE_FILE}
DOCKER_EXEC ?= docker-compose exec -it
DOCKER_RUN ?= ${DOCKER_COMPOSE} run --rm --service-ports

# PHONY sets a virtual target when running Makefile commands, avoids targetting real files!
# -----------------------------------------------------------------------------------------------
install:
	npm install
.PHONY: install

build:
	${DOCKER_COMPOSE} build
.PHONY: build

# update dependencies
update:
	npm install
.PHONY: update
# removes all containers associated with the api
down:
	${DOCKER_COMPOSE} down
.PHONY: down

# starts the images which runs in the an isolated environment
up-all:
	${DOCKER_COMPOSE} up -d --watch
.PHONY: up-all

start:
	npm run start
.PHONY: start

start-dev:
	npm run start:dev
.PHONY: start-dev

test:
	npm run test:watch
.PHONY: test

test-int:
    npm run test:integration
.PHONY: test-int

lint:
	npm run lint
.PHONY: lint

exec:
	${DOCKER_EXEC} api /bin/bash
.PHONY: exec
# Useful aliases
# -----------------------------------------------------------------------------------------------

dev: down up-all
.PHONY: dev

test-integration: dev test-int
.PHONY: test-integration
