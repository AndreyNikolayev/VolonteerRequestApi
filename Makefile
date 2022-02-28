.PHONY: run-dev
run-dev:
	npm run start:dev

.PHONY: seed
seed:
	npm run seed

.PHONY: up
up:
	docker-compose up -d

.PHONY: stop
stop:
	docker-compose stop

.PHONY: ps
ps:
	docker-compose ps
