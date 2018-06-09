# nomnom

## What is nomnom

The goal of this project is to be a single stop for information consumption. It's meant to replace Pocket and Feedbin/Feedly.

Very much a **Work In Progress**.

Like most side project, it's also a playground for experimentation with new technologies.

## Get Started

Add .env files with relevant information filled out in packages/nomnom-server-api and packages/nomnom-app
You will need to create google credentials for the login and an api key for the youtube api (see [Google admin console](https://console.cloud.google.com/home/dashboard))

You then need to start the database and redis

```
# Example in dev
docker run --restart always -p 5432:5432 --name nomnom-db -d postgres
docker run --restart always -p 6379:6379 --name nomnom-redis -d redis
```

Then install and launch the app

```sh
# In ~
yarn install
# In packages/nomnom-server-api
yarn migrate up
yarn start
# In packages/nomnom-app
yarn run dev
```

## Stack

* [Next.JS](https://github.com/zeit/next.js/) for the app client. SSR in a content heavy app === 🏆
* [Styled components](https://github.com/styled-components/styled-components) for styling
* GraphQL for the API using [Apollo](http://dev.apollodata.com/) both on the server and on the client
