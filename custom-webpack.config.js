const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      $ENV: {
        Route: JSON.stringify(process.env.Route)
      }
    })
  ]
};