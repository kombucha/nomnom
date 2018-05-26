const express = require("express");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const next = require("next");

const nextConfig = require("./next.config");

async function start() {
  const PORT = 3000;
  const app = next(nextConfig);
  const handle = app.getRequestHandler();

  await app.prepare();

  const server = express();
  server.use(compression(), cookieParser());

  // FIXME: Temp workaround
  server.use("/img", express.static("/Users/vincentlemeunier/src/nomnom/data/img"));

  server.get("/entries/:entryId", (req, res) => {
    return app.render(req, res, "/entry", req.params);
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}

start();
