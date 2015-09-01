var _                      = require('lodash');
var getResourceDefinition  = require('./getResourceDefinition');
var isOverflow             = require('./isOverflow');

/*
@param {Array} args.resourcesMap List of resources to load
*/
function loadResource(args, resourceName) {
  console.log('loadResource', args)
  if (args.config == null)          throw new Error('Expected args.config');
  if (args.context == null)         throw new Error('Expected args.context');
  if (args.loader == null)          throw new Error('Expected args.loader');
  if (args.props == null)           throw new Error('Expected args.props');
  if (args.props.dispatch == null)  throw new Error('Expected args.props.dispatch');
  if (resourceName == null)         throw new Error('Expected resourceName');

  var options = {
    context:  args.context,
    dispatch: args.props.dispatch,
    props:    args.props
  }

  var result;
  var resourceDefinition = getResourceDefinition(args, resourceName);

  if (isOverflow(args, resourceName)) {
    throw new Error('Too many loads for ' + resourceName)
  } else {
    result = resourceDefinition.load();
  }

  return result;
}

module.exports = loadResource;
