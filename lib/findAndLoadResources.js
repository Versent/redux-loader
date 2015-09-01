var _                      = require('lodash');

var assertResourcesCountOk = require('./assertResourcesCountOk');
var findResources          = require('./findResources');

/*
Find resources using the given config

If all resources are loaded this function returns a map with them
Otherwise it returns an empty map
*/
function findAndLoadResources(args) {
  if (args.config == null)    throw new Error('Expected args.config');
  if (args.context == null)   throw new Error('Expected args.context');
  if (args.loader == null)    throw new Error('Expected args.loader');
  if (args.props == null)     throw new Error('Expected args.props');

  // Check that we are not calling load too many times for any resource
  assertResourcesCountOk(args);

  var resourcesMap = findResources(args);

  // build a map with resources that needs loading
  var resourcesToLoad = [];
  _.each(resourcesMap, function(resource, key) {
    if (resource == null) {
      resourcesToLoad.push(key);
    }
  });

  // Load resources that are not loaded yet
  if (resourcesToLoad.length > 0) {
    args.resourceNames = resourcesToLoad;
    loadResources(args);
    return {};
  }

  return resourcesMap;
}

module.exports = findAndLoadResources;
