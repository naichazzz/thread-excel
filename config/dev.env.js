'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT:'"/api"'
  // API_ROOT:'"http://10.133.64.34:9001/dev/api/v1/iov-user-center/"'
})
