var invariant = require('invariant')

module.exports = function(name, resourceDefinition) {
  invariant(resourceDefinition.id   != null, 'Expected ' + name + ' definition to return .id')
  invariant(resourceDefinition.find != null, 'Expected ' + name + ' definition to return .find')
  invariant(resourceDefinition.load != null, 'Expected ' + name + ' definition to return .load')
}
