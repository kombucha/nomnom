#!/bin/sh

cd "$(dirname "$0")"

../node_modules/.bin/lerna bootstrap
../node_modules/.bin/lerna run clean
../node_modules/.bin/lerna run build

docker-compose stop && \
docker-compose rm && \
docker-compose build --no-cache
