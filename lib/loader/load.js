var invariant      = require('invariant')
var _              = require('lodash')
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
  // console.log('promise', promise)
  invariant(_.isFunction(promise.then), 'Expected ' + name + '.find to return a promise')

  promise
    .then(function(response) {
      dispatch(successAction)
    }).catch(function(err) {
      console.error(err.toString())
      options.error(err)
    })

  return promise
}
