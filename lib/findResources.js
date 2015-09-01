var _                        = require('lodash');

var getResourceDefinition    = require('./getResourceDefinition');
var getResourceNames         = require('./getResourceNames');

/*
Return a map of resourceName with filtered resource/s

@return
e.g. {
  user:     {},
  posts:    null,
  comments: [],
}
*/
function findResources(args) {
  if (args.loader  == null) throw new Error('Expected args.loader');
  if (args.config  == null) throw new Error('Expected args.config');
  if (args.props   == null) throw new Error('Expected args.props');
  if (args.context == null) throw new Error('Expected args.context');

  var resourcesMap = {};
  var resourceNames = getResourceNames(args.config);
  var options = {
    context:  args.context,
    dispatch: args.props.dispatch,
    props:    args.props
  }

  _.each(resourceNames, function(resourceName) {

    var resourceDefinition = getResourceDefinition(args, resourceName);

    // function that given all state, will return the relevant record/s
    var find = resourceDefinition.find;

    /*
    state are in plural, so we don't really know how a resource def
    will match a state e.g. user : users
    we just delegate this to the find
    */
    var result = find(options.props);

    /*
    the find might return undefined e.g. cannot find a user
    undefined will trigger a load
    */

    resourcesMap[resourceName] = result;
  });

  return resourcesMap;
}

module.exports = findResources;
