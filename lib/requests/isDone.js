var actionTypes = require('./actionTypes')

function isDone(requests, id) {
  if (requests == null) throw new Error('Expected to requests')
  if (id == null)       throw new Error('Expected to id')

  var request = requests[id]
  return (request && request.status  === actionTypes.REQUEST_DONE || false)
}

module.exports = isDone
