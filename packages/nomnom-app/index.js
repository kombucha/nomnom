const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const next = require("next");

const nextConfig = require("./next.config");

async function start() {
  const app = next(nextConfig);
  const handle = app.getRequestHandler();

  await app.prepare();

  const server = express();
  server.use(
    morgan("dev", {
      skip: (req, res) => !(res.get("Content-Type") || "").includes("text/html")
    })
  );
  server.use(cookieParser());

  // FIXME: Temp workaround
  server.use("/img", express.static(nextConfig.serverRuntimeConfig.dataPath));

  server.get("/entries/:entryId", (req, res) => {
    return app.render(req, res, "/entry", req.params);
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(nextConfig.serverRuntimeConfig.port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${nextConfig.serverRuntimeConfig.port}`);
  });
}

start();
