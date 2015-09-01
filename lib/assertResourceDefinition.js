function assertResourceDefinition(name, resourceDefinition) {
  if (!resourceDefinition.id)   throw new Error('Expected ' + name + ' definition to return .id')
  if (!resourceDefinition.find) throw new Error('Expected ' + name + ' definition to return .find')
  if (!resourceDefinition.load) throw new Error('Expected ' + name + ' definition to return .load')
}

module.exports = assertResourceDefinition;
