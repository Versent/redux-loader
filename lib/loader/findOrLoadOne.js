var invariant = require('invariant')
var _         = require('lodash')

var assertResourceDefinition = require('./assertResourceDefinition')
var isDone                   = require('../requests/isDone')
var isPending                = require('../requests/isPending')
var load                     = require('./load')

/*
return a map with resources

null for resource not loaded yet

{
  users: [],
  order: {}.
  comments: null
}
*/

module.exports = function(args, resource, resourceName) {

  invariant(args.config  != null,
    'Expected args.config')
  invariant(args.context != null,
    'Expected args.context')
  invariant(args.helper  != null,
    'Expected args.helper')
  invariant(args.loader  != null,
    'Expected args.loader')
  invariant(args.props   != null,
    'Expected args.props')
  invariant(args.props.requests != null,
    'Expected props.requests, you must add the request reducer and pass it to the loader')
  invariant(resource != null,
    'Expected resource')
  invariant(resource != null,
    'Expected resource to be a function')
  invariant(resourceName != null,
    'Expected resourceName')

  var options = {
    context:  args.context,
    dispatch: args.props.dispatch,
    props:    args.props,
  }

  // get definition
  var resourceDefinition = resource(options)
  resourceDefinition.name = resourceName
  assertResourceDefinition(resourceName, resourceDefinition)

  // get id
  var id = resourceDefinition.id
  // console.log(resourceName + ' id', id)

  // check if already loader
  var done    = isDone(args.props.requests, id)
  var pending = isPending(args.props.requests, id)
  // console.log(id + ' done', done)
  // console.log(id + ' pending', pending)

  // if loaded then call find
  if (done) {
    // console.log(resourceName + ' calling find')
    return resourceDefinition.find()
  }

  // if pending leave null
  if (pending) {
    // console.log(resourceName + ' pending, bailing out')
    return null
  }

  // if not pending call load
  // console.log(id + ' calling load')
  _.defer(function() {
    load(args, resourceDefinition)
  })

  return null
}

