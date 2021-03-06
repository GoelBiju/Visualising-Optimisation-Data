module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.externals = {
        react: "React", // Case matters here
        "react-dom": "ReactDOM", // Case matters here
      };

      if (env === "production") {
        //  && !process.env.REACT_APP_E2E_TESTING (we will need the redux state, so we must build it)
        webpackConfig.output.library = "line";
        webpackConfig.output.libraryTarget = "window";

        webpackConfig.output.filename = "[name].js";
        webpackConfig.output.chunkFilename = "[name].chunk.js";

        delete webpackConfig.optimization.splitChunks;
        webpackConfig.optimization.runtimeChunk = false;
      }

      return webpackConfig;
    },
  },
};
