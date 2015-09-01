var _                      = require('lodash');

var assertResourcesCountOk = require('./assertResourcesCountOk');
var findResources          = require('./findResources');
var loadResource           = require('./loadResource');

/*
Find resources using the given config

Load resources that are not loaded yet
Returns a map with the resources
*/
function findAndLoadResources(args) {
  if (args.config == null)    throw new Error('Expected args.config');
  if (args.context == null)   throw new Error('Expected args.context');
  if (args.loader == null)    throw new Error('Expected args.loader');
  if (args.props == null)     throw new Error('Expected args.props');

  // Check that we are not calling load too many times for any resource
  assertResourcesCountOk(args);

  var resourcesMap = findResources(args);
  // console.log('resourcesMap', resourcesMap)

  // build a map with resources that needs loading

  _.each(resourcesMap, function(resource, resourceName) {
    var loaded = resource != null;

    if (!loaded) {
      // console.log('resourceName', resourceName)
      loadResource(args, resourceName);
    }
  });

  return resourcesMap;
}

module.exports = findAndLoadResources;
