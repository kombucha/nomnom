const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const next = require("next");
const helmet = require("helmet");
const uuidv4 = require("uuid/v4");

const nextConfig = require("./next.config");

async function start() {
  const app = next(nextConfig);
  const handle = app.getRequestHandler();

  await app.prepare();

  const server = express();

  // Loggin
  server.use(
    morgan("dev", {
      skip: (req, res) => !(res.get("Content-Type") || "").includes("text/html")
    })
  );

  // Security
  server.use(function(req, res, next) {
    res.locals.nonce = uuidv4();
    next();
  });
  server.use(
    helmet({
      referrerPolicy: { policy: "same-origin" }
      // Waiting for https://github.com/zeit/next.js/pull/4539 to pass...
      // contentSecurityPolicy: {
      //   directives: {
      //     objectSrc: ["'none'"],
      //     scriptSrc: [
      //       (req, res) => `'nonce-${res.locals.nonce}'`,
      //       "'unsafe-inline'",
      //       "'unsafe-eval'",
      //       "'strict-dynamic'",
      //       "https: http:"
      //     ],
      //     baseUri: ["'none'"]
      //   }
      // }
    })
  );

  server.use(cookieParser());

  server.get("/entries/:entryId", (req, res) => {
    return app.render(req, res, "/entry", req.params);
  });

  server.get("*", (req, res) => handle(req, res));

  server.listen(nextConfig.serverRuntimeConfig.port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${nextConfig.serverRuntimeConfig.port}`);
  });
}

start();
