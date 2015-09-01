var _                         = require('lodash');
var assertResourceDefinition  = require('./assertResourceDefinition');

function getResourceDefinition(args, resourceName) {
  if (args.config  == null)    throw new Error('Expected args.config');
  if (resourceName == null)    throw new Error('Expected resourceName');

  var resourceDefinitionCreator = args.config.resources[resourceName];
  if (!_.isFunction(resourceDefinitionCreator)) throw new Error(resourceName + 'to be a function');

  var options = {
    context:  args.context,
    dispatch: args.props.dispatch,
    props:    args.props
  }

  var resourceDefinition = resourceDefinitionCreator(options);
  assertResourceDefinition(resourceName, resourceDefinition);

  return resourceDefinition;
}

module.exports = getResourceDefinition;
