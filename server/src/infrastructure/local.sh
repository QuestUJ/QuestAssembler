#!/bin/sh

echo "1. Pulling docker image"
docker pull postgres

echo "2. Removing old container"
docker rm -f quasm-db
echo "3. Creating and running container"
docker run -d --name quasm-db -p 5434:5432 -e POSTGRES_DB=quasm -e POSTGRES_PASSWORD=root postgres
