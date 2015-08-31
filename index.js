var React             = require('react');
var _                 = require('lodash');
// var connect           = require('react-redux').connect;

var PT                = React.PropTypes

function assertResourceDefinition(name, resourceDefinition) {
	if (!resourceDefinition.id)   throw new Error('Expected ' + name + ' definition to return an id')
	if (!resourceDefinition.find) throw new Error('Expected ' + name + ' definition to return an id')
	if (!resourceDefinition.load) throw new Error('Expected ' + name + ' definition to return an id')
}

/*
Return the names of the resources to load
e.g. ['user', 'comments']
*/
function getResourceNames(config) {
	if (config.resources == null) throw new Error('Expected config.resources');
	return Object.keys(config.resources);
}

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
	if (args.loader == null)    throw new Error('Expected args.loader');
	if (args.config == null)    throw new Error('Expected args.config');
	if (args.props == null)     throw new Error('Expected args.props');
	if (args.context == null)   throw new Error('Expected args.context');

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

function assertResourceCountOk(args, resourceName) {
	if (args.config == null)    throw new Error('Expected args.config');
	if (args.loader == null)    throw new Error('Expected args.loader');

	var resourceDefinition = getResourceDefinition(args, resourceName);

	var loader = args.loader;

	var id = resourceDefinition.id;
	if (id == null) throw new Error(resourceName + '.id not found');

	var storedResourceData = loader._resources[resourceName] || {}

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

	if (storedResourceData.count > 25) throw new Error(resourceName + ' is generating too many fetches')

	loader._resources[resourceName] = storedResourceData;
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

function findAndLoadResources(args) {

	if (args.config == null)    throw new Error('Expected args.config');
	if (args.context == null)   throw new Error('Expected args.context');
	if (args.loader == null)    throw new Error('Expected args.loader');
	if (args.props == null)     throw new Error('Expected args.props');

	assertResourcesCountOk(args);

	var resourcesMap = findResources(args);

	var resourcesToLoad = [];

	_.each(resourcesMap, function(resource, key) {
		if (resource == null) {
			resourcesToLoad.push(key);
		}
	});

	// console.log('resourcesToLoad', resourcesToLoad);

	if (resourcesToLoad.length > 0) {
		args.resourceNames = resourcesToLoad;
		loadResources(args);
		return {};
	}

	return resourcesMap;
}

function assertConfig(config) {
	if (!config.resources) throw new Error('Expected config.resources');
	if (!config.component) throw new Error('Expected config.resources');
	if (!config.busy)      throw new Error('Expected config.busy');

	// validated resources
	_.each(config.resources, function(resource, key) {
		if (!_.isFunction(resource))   throw new Error('Expected ' + key + ' to be function');
	});
}

/*
Creates a Loader Component and a Wrapper
Show a spinner when loading the resources

The specified resources will be passed to the child component
as props.

@param {Class} config.component React component to show when done
@param {Class} config.busy React component to show when loading
@param {Map} config.resources A map with resources to fetch
*/
function createLoader(config) {
	assertConfig(config);

	var Loader = React.createClass({
		getInitialState: function() {
			return {
				loading: true
			};
		},

		/*
		This happens when the component is first loaded
		*/
		componentDidMount: function() {
			this.processResources(this.props, this.context)
		},

		/*
		This happens when a route is changed
		*/
		componentWillReceiveProps: function(nextProps) {
			this.processResources(nextProps, this.context)
		},

		processResources: function(props, context) {
			var args = {
				config:  config,
				context: context,
				loader:  this,
				props:   props,
			}
			var resourcesMap = findAndLoadResources(args);
			var loading = true;

			if (Object.keys(resourcesMap).length > 0) {
				// render the component
				loading = false;
			}

			this.setState({
				loading: loading
			});

		},

		renderLoading: function() {
			return React.createElement(config.busy);
		},

		renderComponent: function() {
			var args = {
				config:config, 
				context: this.context,
				loader: this, 
				props: this.props, 
			}
			var resourcesMap = findResources(args);
			if (Object.keys(resourcesMap).length == 0) throw new Error('Loaded resources is 0');

			var undefinedKeys = _(resourcesMap)
					.map(function(value, key) {
						return [key, value]
					}).select(function(tuple) {
						return _.isUndefined(tuple[1]);
					}).map(function(tuple) {
						return tuple[0];
					})
					.value();

			if (undefinedKeys.length) {
				// log('Rendering error div')
				return React.createElement('div', null, 'Cant render component. Cannot find resources: ' + undefinedKeys);
			} else {
				// log('Rendering given component')
				var props = _.clone(this.props)
				_.extend(props, resourcesMap);
				return React.createElement(config.component, props);
			}

		},

		render: function() {
			if (this.state.loading) {
				return this.renderLoading()
			} else {
				return this.renderComponent()
			}
		}

	});

	return Loader
}

module.exports = createLoader;
