var _         = require('lodash')
var invariant = require('invariant')

module.exports = function(config) {
  invariant(config.resources != null, 'Expected config.resources')
  invariant(config.component != null, 'Expected config.component')
  invariant(config.busy != null, 'Expected config.busy')

  // validated resources
  _.each(config.resources, function(resource, key) {
    invariant(_.isFunction(resource), 'Expected ' + key + ' to be function')
  })
}
