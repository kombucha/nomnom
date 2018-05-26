const { Router } = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");

const logger = require("../core/logger");
const { login } = require("../core/user");

const loginRouter = new Router();

loginRouter.use(bodyParser.text());

/**
 * See https://developers.google.com/identity/sign-in/web/server-side-flow
 * But they're lying !!! redirectUri can't actually be blank it seems...
 */
loginRouter.post("/google", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL || ""
  );
  const authorizationCode = req.body;

  try {
    const { tokens } = await oauth2Client.getToken(authorizationCode);
    oauth2Client.setCredentials(tokens);
    const profileRes = await google.plus("v1").people.get({
      userId: "me",
      auth: oauth2Client
    });

    const { token } = await login(simpleProfile(profileRes.data));
    res.send(token);
  } catch (error) {
    logger.error(error);
    res.status(500).send("Woopsy !");
  }
});

function simpleProfile(googleProfile) {
  const email = googleProfile.emails.find(email => email.type === "account") || {
    value: ""
  };

  return {
    name: googleProfile.displayName,
    avatarUrl: googleProfile.image ? googleProfile.image.url : "",
    email: email.value
  };
}

module.exports = loginRouter;
