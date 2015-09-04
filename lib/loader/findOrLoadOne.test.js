var test          = require('ava')
var subject       = 'findOrLoadOne '
var findOrLoadOne = require('./findOrLoadOne')

function makeArgs() {
  return {
    config:  {},
    context: {},
    helper:  {},
    props:   {
      dispatch: function() {},
      requests: [],
    },
  }
}

function makeDefinition() {
  return function(options) {
    return {
      id: '/users/1',
      load: function() {
        return new Promise(function() {})
      },
      find: function() {},
    }
  }
}

test(subject + 'it works', function(t) {
  var args = makeArgs()
  var resource = makeDefinition()
  var name = 'user'
  findOrLoadOne(args, resource, name)

  setTimeout(function() {
    t.end()
  }, 0)
})

test(subject + ' throws if id not provided', function(t) {
  t.end()
})
//
// throws if load not provided
//
// thros if find not provided

test(subject + ' calls load when not pending', function(t) {
  t.end()
})

// doesnt call load when pending
//
// returns null when pending
//
// returns null when pending and not done
//
// calls find when done
//
// passes the dispatch, props and context to resource

