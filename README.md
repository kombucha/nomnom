# nomnom

## What is nomnom
The goal of this project is to be a single stop for information consumption. It's meant to replace Pocket and Feedbin/Feedly.

Very much a **Work In Progress**. 

Like most side project, it's also a playground for experimentation with new technologies.

## Get Started
Add .env files with relevant information filled out in packages/nomnom-server-api and packages/nomnom-app
You will need to create google credentials for the login and an api key for the youtube api (see [Google admin console](https://console.cloud.google.com/home/dashboard))

You then need to start the database
```
# Example in dev
cd db
docker build -t nomnom-db .
docker run -p 5432:5432 -e POSTGRES_DB=nomnom -d nomnom-db
```

Then install and launch the app
```sh
# In ~
npm install
# In packages/nomnom-server-api
npm start
# In packages/nomnom-app
npm run dev
```

## Stack
- [Next.JS](https://github.com/zeit/next.js/) for the app client. SSR in a content heavy app === 🏆
- [Styled components](https://github.com/styled-components/styled-components) for styling
- GraphQL for the API using [Apollo](http://dev.apollodata.com/) both on the server and on the client
