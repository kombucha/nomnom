const express = require("express");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const next = require("next");

async function start() {
  const dev = process.env.NODE_ENV !== "production";
  const PORT = 3000;
  const app = next({ dev });
  const handle = app.getRequestHandler();

  await app.prepare();

  const server = express();
  server.use(compression(), cookieParser());

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
