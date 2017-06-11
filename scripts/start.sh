#!/bin/sh

cd "$(dirname "$0")"

# TODO: run database

../node_modules/.bin/lerna bootstrap
../node_modules/.bin/lerna run start
