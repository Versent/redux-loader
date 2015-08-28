var React             = require('react');
var _                 = require('lodash');
// var connect           = require('react-redux').connect;
var invariant         = require('invariant');

var PT                = React.PropTypes

/*
Return the names of the resources to load
e.g. ['user', 'comments']
*/
function getResourceNames(config) {
	return Object.keys(config.resources);
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
function findResources(config, loader, props, context) {
	console.log('findResources');

	invariant(loader != null, 'loader is null');
	invariant(props != null, 'props is null');
	invariant(props.dispatch != null, 'props.dispatch is null');
	invariant(context != null, 'context is null');

	var resourcesMap = {};
	var resourceNames = getResourceNames(config);
	var options = {
		context: context,
		dispatch: props.dispatch,
		props: props
	}

	_.each(resourceNames, function(resourceName) {

		var resourceDefinition = config.resources[resourceName];
		invariant(resourceDefinition != null, 'resourceDefinition for ' + resourceName + ' not found')
		invariant(resourceDefinition.find != null, resourceName + '.find not found')

		// function that given all state, will return the relevant record/s
		var find = resourceDefinition.find;

		/*
		state are in plural, so we don't really know how a resource def
		will match a state e.g. user : users
		we just delegate this to the find
		*/
		var result = find(options);

		/*
		the find might return undefined e.g. cannot find a user
		undefined will trigger a load
		*/

		resourcesMap[resourceName] = result;
	});

	return resourcesMap;
}

function loadResources(config, loader, props, context, resourceNames) {
	console.log('loadResource', resourceNames);

	invariant(loader != null, 'loader is null');
	invariant(props != null, 'props is null');
	invariant(props.dispatch != null, 'props.dispatch is null');
	invariant(context != null, 'context is null');
	invariant(resourceNames != null, 'resourceNames is null');

	var resourcesMap = {};
	var options = {
		context: context,
		dispatch: props.dispatch,
		props: props
	}

	_.each(resourceNames, function(resourceName) {
		var resourceDefinition = config.resources[resourceName];
		invariant(resourceDefinition != null, 'resourceDefinition for ' + resourceName + ' not found')
		invariant(resourceDefinition.load != null, resourceName + '.load not found')

		var load = resourceDefinition.load;
		var result = load(options);

		resourcesMap[resourceName] = result;
	});

	return resourcesMap;
}

function findAndLoadResources(config, loader, props, context) {
	invariant(loader != null, 'loader is null');
	invariant(props != null, 'props is null');
	invariant(props.dispatch != null, 'props.dispatch is null');
	invariant(context != null, 'context is null');

	var resourcesMap = findResources(config, loader, props, context);

	var resourcesToLoad = [];

	_.each(resourcesMap, function(resource, key) {
		if (resource == null) {
			resourcesToLoad.push(key);
		}
	});

	console.log('resourcesToLoad', resourcesToLoad);

	if (resourcesToLoad.length > 0) {
		loadResources(config, loader, props, context, resourcesToLoad);
		return {};
	}

	return resourcesMap;
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

	console.log('createLoader', config)

	if (!config.resources) throw new Error('Expected config.resources');
	if (!config.component) throw new Error('Expected config.resources');
	if (!config.busy)      throw new Error('Expected config.busy');

	// validated resources
	_.each(config.resources, function(resource) {
		if (!resource.find) throw new Error('Expected resource.find');
		if (!resource.load) throw new Error('Expected resource.load');
	});

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
			var resourcesMap = findAndLoadResources(config, this, props, context);
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
			var resourcesMap = findResources(config, this, this.props, this.context);
			invariant(Object.keys(resourcesMap).length != 0, 'Loaded resources is 0');

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
