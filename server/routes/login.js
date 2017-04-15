const { Router } = require("express");
const bodyParser = require("body-parser");
const google = require("googleapis");
const config = require("../config");
const promisify = require("../utils/promisify");
const logger = require("../services/logger");
const { login } = require("../services/user");

const loginRouter = new Router();

loginRouter.use(bodyParser.text());

/**
 * See https://developers.google.com/identity/sign-in/web/server-side-flow
 * But they're lying !!! redirectUri can't actually be blank it seems...
 */
loginRouter.post("/google", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    config.google.clientId,
    config.google.clientSecret,
    config.google.redirectUrl
  );
  const plus = google.plus("v1").people;
  const loadTokens = promisify(oauth2Client.getToken, oauth2Client);
  const loadUserProfile = promisify(plus.get, plus);

  const authorizationCode = req.body;
  try {
    const tokens = await loadTokens(authorizationCode);
    oauth2Client.setCredentials(tokens);
    const googleProfile = await loadUserProfile({
      userId: "me",
      auth: oauth2Client
    });

    const { token } = await login(simpleProfile(googleProfile));
    res.send(token);
  } catch (error) {
    logger.error(error);
    res.status(500).send("Woopsy !");
  }
});

function simpleProfile(googleProfile) {
  const email = googleProfile.emails.find(
    email => email.type === "account"
  ) || {
    value: ""
  };

  return {
    name: googleProfile.displayName,
    avatarUrl: googleProfile.image ? googleProfile.image.url : "",
    email: email.value
  };
}

module.exports = loginRouter;
