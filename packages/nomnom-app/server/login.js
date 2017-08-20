const { Router } = require("express");
const bodyParser = require("body-parser");
const google = require("googleapis");

const promisify = require("nomnom-server-core/utils/promisify");
const logger = require("nomnom-server-core/logger");
const { login } = require("nomnom-server-core/user");

const plus = google.plus("v1").people;
const loadUserProfile = promisify(plus.get, plus);

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
  const loadTokens = promisify(oauth2Client.getToken, oauth2Client);

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
  const accountEmail = googleProfile.emails.find(email => email.type === "account");

  return {
    name: googleProfile.displayName,
    avatarUrl: googleProfile.image ? googleProfile.image.url : "",
    email: accountEmail ? accountEmail.value : ""
  };
}

module.exports = loginRouter;
