module.exports = {
  dev: process.env.NODE_ENV !== "production",
  publicRuntimeConfig: {
    apiUrl: process.env.API_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID
  },
  serverRuntimeConfig: {
    someSecret: "SECRET"
  }
};
