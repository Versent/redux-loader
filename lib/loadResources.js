var _                      = require('lodash');
var getResourceDefinition  = require('./getResourceDefinition');

/*
@param {Array} args.resourcesMap List of resources to load
*/
function loadResources(args) {
  if (args.config == null)          throw new Error('Expected args.config');
  if (args.context == null)         throw new Error('Expected args.context');
  if (args.loader == null)          throw new Error('Expected args.loader');
  if (args.props == null)           throw new Error('Expected args.props');
  if (args.props.dispatch == null)  throw new Error('Expected args.props.dispatch');
  if (args.resourceNames == null)   throw new Error('Expected args.resourceNames');

  var resourcesMap = {};
  var options = {
    context:  args.context,
    dispatch: args.props.dispatch,
    props:    args.props
  }

  _.each(args.resourceNames, function(resourceName) {
    var resourceDefinition = getResourceDefinition(args, resourceName);

    var load = resourceDefinition.load;
    var result = load();

    resourcesMap[resourceName] = result;
  });

  return resourcesMap;
}

module.exports = loadResources;
