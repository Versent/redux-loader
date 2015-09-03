var actionTypes = require('./actionTypes')

function isDone(requests, id) {
  if (requests == null) throw new Error('Expected to requests')
  if (id == null)       throw new Error('Expected to id')

  // console.log(id)
  // console.log(requests)
  // console.log(requests[id])

  var request = requests[id]
  return (request && request.status  === actionTypes.REQUEST_START || false)
}

module.exports = isDone
