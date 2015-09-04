var invariant      = require('invariant')
var _              = require('lodash')
var isPending      = require('../requests/isPending')
var isDone         = require('../requests/isDone')
var actionTypes    = require('../requests/actionTypes')

module.exports = function(args, resourceDefinition) {
  invariant(args.props != null, 'Expected args.props')
  invariant(args.props.dispatch != null, 'Expected args.props.dispatch')

  var name = resourceDefinition.name

  invariant(name != null, 'Expected resourceDefinition.name')
  invariant(resourceDefinition.id != null, 'Expected ' + name + '.id')
  invariant(resourceDefinition.load != null, 'Expected ' + name +  '.load')

  // console.log('load', resourceDefinition)

  var dispatch = args.props.dispatch
  var id = resourceDefinition.id
  var pending = isPending(args.props.requests, id)

  if (pending) return

  var startAction = {
    id:   id,
    type: actionTypes.REQUEST_START,
  }

  var successAction = {
    id:   id,
    type: actionTypes.REQUEST_DONE,
  }

  dispatch(startAction)

  var promise = resourceDefinition.load()
  var message = 'Expected ' + name + '.load to return a promise'
  invariant(promise != null, message)
  invariant(promise.then != null, message)
  invariant(_.isFunction(promise.then), message)

  promise
    .then(function(response) {
      // avoid dispatching if already marked as done
      var done = isDone(args.props.requests, id)
      // console.log(id, 'request done', done)
      if (!done) dispatch(successAction)
    }).catch(function(err) {
      console.error(err.toString())
      options.error(err)
    })

  return promise
}
