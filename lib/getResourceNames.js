var _                      = require('lodash');

/*
Return the names of the resources to load
e.g. ['user', 'comments']
*/
function getResourceNames(config) {
  if (config.resources == null) throw new Error('Expected config.resources');
  return Object.keys(config.resources);
}

module.exports = getResourceNames;
