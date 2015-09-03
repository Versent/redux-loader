var getResourceDefinition = require('./getResourceDefinition');

function isOverflow(args, resourceName) {
  if (args.config == null)    throw new Error('Expected args.config');
  if (args.loader == null)    throw new Error('Expected args.loader');
  if (resourceName == null)   throw new Error('Expected resourceName');

  var resourceDefinition = getResourceDefinition(args, resourceName);
  var loader = args.loader;
  var id = resourceDefinition.id;
  if (id == null) throw new Error(resourceName + '.id not found');

  var storedResourceData = loader._resources[resourceName] || {}

  return storedResourceData.count > 25;
}

module.exports = isOverflow
