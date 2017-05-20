const { Router } = require("express");
const updateFeeds = require("../jobs/updateFeeds");

const jobsRouter = new Router();

jobsRouter.all("/", (req, res) => {
  // One job for now, just trigger this one
  updateFeeds();
  res.sendStatus(200);
});

module.exports = jobsRouter;
