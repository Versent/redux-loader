var actionTypes = require('./actionTypes')
var SI          = require('seamless-immutable')

function changeStatus(state, action, status) {
  var id = action.id
  if (id == null) throw new Error('Expected action.id')

  var request = state[id] || SI({})

  request = request.merge({status:  status})
  var merge = {}
  merge[id] = request
  var newState = state.without(id).merge(merge)
  return newState
}

function reducer(state, action) {
  state = state || SI({})

  switch (action.type) {
  case actionTypes.REQUEST_START:
    return changeStatus(state, action, actionTypes.REQUEST_START)
  case actionTypes.REQUEST_DONE:
    return changeStatus(state, action, actionTypes.REQUEST_DONE)
  default:
    return state
  }
}

module.exports = reducer
