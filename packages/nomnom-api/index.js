const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const logger = require("./core/logger");
const authMiddleware = require("./middlewares/authMiddleware");
const loadersMiddleware = require("./middlewares/loadersMiddleware");
const graphqlMiddleware = require("./middlewares/graphlMiddleware");
const loginRouter = require("./routes/login");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev", { stream: logger.stream }));
app.use("/img", express.static(process.env.DATA_PATH));
app.use("/login", loginRouter);

app.use(
  "/graphql",
  authMiddleware(),
  loadersMiddleware(),
  bodyParser.json({ limit: "2mb" }),
  graphqlMiddleware()
);

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

process.on("uncaughtException", err => {
  logger.error("uncaughtException", err.stack);
});

process.on("unhandledRejection", reason => {
  logger.error("unhandledRejection", reason);
});

const port = parseInt(process.env.PORT, 10);
app.listen(port);
logger.info(`Running api server at http://localhost:${port}`);
