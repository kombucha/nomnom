# Plugins

dokku plugin:install https://github.com/iamale/dokku-monorepo.git monorepo
dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres
dokku plugin:install https://github.com/dokku/dokku-redis.git redis

# Create apps

dokku apps:create nomnom-app
dokku apps:create nomnom-api

# Storage (http://dokku.viewdocs.io/dokku/advanced-usage/persistent-storage/#usage)

mkdir -p /var/lib/dokku/data/storage/nomnom
chown -R dokku:dokku /var/lib/dokku/data/storage/nomnom/
chown -R 32767:32767 /var/lib/dokku/data/storage/node-js-app
dokku storage:mount nomnom-api /var/lib/dokku/data/storage/nomnom:/app/storage
dokku storage:mount nomnom-app /var/lib/dokku/data/storage/nomnom:/app/storage

# Database

dokku postgres:create nomnom-db
dokku postgres:link nomnom-db nomnom-api

# Redis

dokku redis:create nomnom-redis
dokku redis:link nomnom-redis nomnom-api

# Config / Environment variables

dokku config:set nomnom-app API\*URL=https://nomnom-api.limbocitizen.com DATA\*PATH=/app/storage GOOGLE_CLIENT_ID=**\***
dokku config:set nomnom-api IMAGES_PATH=/app/storage JWT_ALGORITHM=HS256 GOOGLE_REDIRECT_URL=https://nomnom-app.limbocitizen.com GOOGLE_CLIENT_ID=\*\** GOOGLE*CLIENT_SECRET=**\* JWT_SECRET=\*** YOUTUBE*API_KEY=*\*\*

# Deploy !

git push

# SSL Stuff

dokku letsencrypt nomnom-app
dokku letsencrypt nomnom-api
