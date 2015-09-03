var _ = require('lodash')

function assertConfig(config) {
  if (!config.resources) throw new Error('Expected config.resources')
  if (!config.component) throw new Error('Expected config.resources')
  if (!config.busy)      throw new Error('Expected config.busy')

  // validated resources
  _.each(config.resources, function(resource, key) {
    if (!_.isFunction(resource))   throw new Error('Expected ' + key + ' to be function')
  })
}

module.exports = assertConfig
