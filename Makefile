init: docker-up install prod

#all
docker-up: docker-down
	docker-compose up -d --build

docker-log: docker-down
	docker-compose up --build

docker-down:
	docker-compose stop
	docker-compose down

permission-755:
	sudo chmod -R 755 ./src/

permission-777:
	sudo chmod -R 777 ./src/

console:
	docker-compose exec --user $(shell id -u):$(shell id -g)  node sh -c "/bin/bash"

dev:
	docker-compose exec --user $(shell id -u):$(shell id -g)  node sh -c "yarn start --host=0.0.0.0"

prod:
	docker-compose exec --user $(shell id -u):$(shell id -g)  node sh -c "yarn build"

install:
	docker-compose exec --user $(shell id -u):$(shell id -g)  node sh -c "yarn"

lint:
	docker-compose exec --user $(shell id -u):$(shell id -g)  node sh -c "yarn lint"

format:
	docker-compose exec --user $(shell id -u):$(shell id -g)  node sh -c "yarn format"

test:
	docker-compose exec --user $(shell id -u):$(shell id -g)  node sh -c "yarn test"

