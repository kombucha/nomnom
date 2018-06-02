# Plugins

dokku plugin:install https://github.com/iamale/dokku-monorepo.git monorepo
dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres
dokku plugin:install https://github.com/dokku/dokku-redis.git redis

# Create apps

dokku apps:create nomnom-app
dokku apps:create nomnom-api
dokku apps:create nomnom-img

# Storage (http://dokku.viewdocs.io/dokku/advanced-usage/persistent-storage/#usage)

mkdir -p /var/lib/dokku/data/storage/nomnom
chown -R dokku:dokku /var/lib/dokku/data/storage/nomnom/
chown -R 32767:32767 /var/lib/dokku/data/storage/node-js-app
dokku storage:mount nomnom-api /var/lib/dokku/data/storage/nomnom:/app/storage
dokku storage:mount nomnom-img /var/lib/dokku/data/storage/nomnom:/app/storage

# Database

dokku postgres:create nomnom-db
dokku postgres:link nomnom-db nomnom-api

# Redis

dokku redis:create nomnom-redis
dokku redis:link nomnom-redis nomnom-api

# Config / Environment variables

dokku config:set nomnom-app API_URL=https://nomnom-api.limbocitizen.com GOOGLE_CLIENT_ID=\*\*\*
dokku config:set nomnom-api DATA_PATH=/app/storage JWT_ALGORITHM=HS256 IMG_BASE_URL=https://nomnom-img.limbocitizen.com/ GOOGLE_REDIRECT_URL=https://nomnom-app.limbocitizen.com GOOGLE_CLIENT_ID=\*\*\* GOOGLE_CLIENT_SECRET=\*\*\* JWT_SECRET=\*\*\* YOUTUBE_API_KEY=\*\*\* ARENA_USERNAME=\*\*\* ARENA_PASSWORD=\*\*\*
dokku config:set nomnom-img DATA_PATH=/app/storage

# Process stuff

dokku checks:skip node-js-app worker,web
dokku ps:scale nomnom-api web=1 worker=1

# Deploy !

git push

# SSL Stuff

dokku letsencrypt nomnom-app
dokku letsencrypt nomnom-api
dokku letsencrypt nomnom-img

# Logs

`vim /etc/logrotate.d/docker`

Content:

```
/var/lib/docker/containers/*/*.log {
  rotate 7
  daily
  compress
  size=1M
  missingok
  delaycompress
  copytruncate
}
```

# Datadog

DD_API_KEY=\*\*\* bash -c "$(curl -L https://raw.githubusercontent.com/DataDog/datadog-agent/master/cmd/agent/install_script.sh)"
[Docker integration](https://app.datadoghq.com/account/settings#integrations/docker)
