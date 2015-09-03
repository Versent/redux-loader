var _                     = require('lodash');
var getResourceDefinition = require('./getResourceDefinition');
var getResourceNames      = require('./getResourceNames');
var isOverflow            = require('./isOverflow');

function assertResourceCountOk(args, resourceName) {
  if (args.config == null)    throw new Error('Expected args.config');
  if (args.loader == null)    throw new Error('Expected args.loader');
  if (resourceName == null)   throw new Error('Expected resourceName');

  var resourceDefinition = getResourceDefinition(args, resourceName);

  var loader = args.loader;

  var id = resourceDefinition.id;
  if (id == null) throw new Error(resourceName + '.id not found');

  var storedResourceData = loader._resources[resourceName] || {}
  // console.log('storedResourceData', storedResourceData)

  var reset = false;

  if (storedResourceData.id == null)  reset = true;
  if (storedResourceData.id != id)    reset = true;

  if (reset) {
    storedResourceData = {
      id: id,
      count: 0,
    }
  } else {
    storedResourceData.count ++;
  }

  loader._resources[resourceName] = storedResourceData;

  if (isOverflow(args, resourceName)) throw new Error(resourceName + ' is generating too many fetches')
}

function assertResourcesCountOk(args) {
  if (args.loader == null)    throw new Error('Expected args.loader');
  if (args.config == null)    throw new Error('Expected args.config');

  var loader = args.loader;
  loader._resources = loader._resources || {};
  var resourceNames = getResourceNames(args.config);

  _.each(resourceNames, function(resourceName) {
    assertResourceCountOk(args, resourceName);
  });
}

module.exports = assertResourcesCountOk;
