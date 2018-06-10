const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const { ANALYZE, NODE_ENV, API_URL, GOOGLE_CLIENT_ID, PORT } = process.env;

module.exports = {
  dev: NODE_ENV !== "production",
  publicRuntimeConfig: {
    apiUrl: API_URL,
    googleClientId: GOOGLE_CLIENT_ID
  },
  serverRuntimeConfig: {
    port: PORT
  },

  webpack: function(config, { isServer }) {
    if (ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true
        })
      );
    }

    return config;
  }
};
