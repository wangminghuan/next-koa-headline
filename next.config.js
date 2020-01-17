// const withLess = require('@zeit/next-less')
const withCss = require('@zeit/next-css');
const withImages = require('next-images')
const withPlugins = require("next-compose-plugins");
// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.css'] = (file) => {}
}
module.exports = withPlugins([withCss,withImages],{
  webpack: (config, { isServer }) => {
    if (isServer) {
      const antStyles = /antd-mobile\/.*?\/style.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ]

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      })
    }
    return config
  },
})