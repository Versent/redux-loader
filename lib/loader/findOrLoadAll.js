var invariant       = require('invariant')
var _               = require('lodash')
var findOrLoadOne   = require('./findOrLoadOne')

/*
return a map with resources

null for resource not loaded yet

{
  users: [],
  order: {}.
  comments: null
}
*/

module.exports = function(args) {

  invariant(args.config  != null,
    'Expected args.config')
  invariant(args.context != null,
    'Expected args.context')
  invariant(args.helper  != null,
    'Expected args.helper')
  invariant(args.props   != null,
    'Expected args.props')
  invariant(args.props.requests != null,
    'Expected props.requests, you must add the request reducer and pass it to the loader')

  var resourcesMap = {}

  _.each(args.config.resources, function(val, key) {
    resourcesMap[key] = findOrLoadOne(args, val, key)
  })

  return resourcesMap
}

