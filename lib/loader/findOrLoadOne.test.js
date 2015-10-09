var test          = require('ava')
var rewire        = require("rewire")
var bluebird      = require('bluebird')
var sinon         = require('sinon')
var subject       = 'findOrLoadOne '
var findOrLoadOne = rewire('./findOrLoadOne')

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
        return new bluebird.Promise(function() {})
      },
      find: function() {},
    }
  }
}

test.serial(subject + 'it works', function(t) {
  var args = makeArgs()
  var resource = makeDefinition()
  var name = 'user'
  findOrLoadOne(args, resource, name)

  setTimeout(function() {
    t.end()
  }, 0)
})

test.serial(subject + 'returns null if pending', function(t) {
  var args = makeArgs()
  var resource = makeDefinition()
  var name = 'user'
  var res = findOrLoadOne(args, resource, name)

  t.same(res, null, 'result is null')
  t.end()
})

test.serial(subject + ' calls load when not pending', function(t) {
  t.plan(1)
  var args = makeArgs()
  var resource = makeDefinition()
  var name = 'user'
  var load = sinon.spy()

  findOrLoadOne.__set__('load', load);
  findOrLoadOne.__set__('isPending', function() { return false });

  findOrLoadOne(args, resource, name)

  setTimeout(function() {
    t.ok(load.calledOnce, 'load is called')
  }, 0)
})

test.serial(subject + ' doesnt call load when pending', function(t) {
  t.plan(1)
  var args = makeArgs()
  var resource = makeDefinition()
  var name = 'user'
  var load = sinon.spy()

  findOrLoadOne.__set__('load', load);
  findOrLoadOne.__set__('isPending', function() { return true });

  findOrLoadOne(args, resource, name)

  setTimeout(function() {
    t.same(load.callCount, 0, 'load is not called')
  }, 0)
})

//
// returns null when pending
//
// returns null when pending and not done
//
// calls find when done
//
// passes the dispatch, props and context to resource

