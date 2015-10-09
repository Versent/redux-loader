var invariant = require('invariant')
var _         = require('lodash')

var assertResourceDefinition = require('./assertResourceDefinition')
var isDone                   = require('../requests/isDone')
var isPending                = require('../requests/isPending')
var load                     = require('./load')

/*
@arg {Function} resourceDefinition e.g. function that returns an object with load and find
*/
module.exports = function(args, resourceDefinition, resourceName) {

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
  invariant(resourceDefinition != null,
    'Expected resourceDefinition')
  invariant(_.isFunction(resourceDefinition),
    'Expected resourceDefinition to be a function')
  invariant(resourceName != null,
    'Expected resourceName')

  var options = {
    context:  args.context,
    dispatch: args.props.dispatch,
    props:    args.props,
  }

  // get definition
  var resourceDefinition = resourceDefinition(options)
  resourceDefinition.name = resourceName
  assertResourceDefinition(resourceName, resourceDefinition)

  // get id
  var id = resourceDefinition.id

  // check if already loader
  var done    = isDone(args.props.requests, id)
  var pending = isPending(args.props.requests, id)

  // console.log('done', done)
  // console.log('pending', pending)

  // if loaded then call find
  if (done) {
    var resource = resourceDefinition.find()
    if (resource == null) console.warn('Warning: ' + resourceName + '.find returned null')
    return resource
  }

  // if pending leave null
  if (pending) {
    return null
  }

  // if not pending call load
  _.defer(function() {
    load(args, resourceDefinition)
  })

  return null
}

