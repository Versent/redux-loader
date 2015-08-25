var React             = require('react');
var _                 = require('lodash');
var connect           = require('react-redux').connect;

var PT                = React.PropTypes
// var log               = bows('app.Loader')

/*
Creates a Loader Component and a Wrapper
Show a spinner when loading the resources

The specified resources will be passed to the child component
as props.

@param {Class} options.component React component to show when done
@param {Class} options.busy React component to show when loading
@param {Map} options.resources A map with resources to fetch
*/
function makeLoader(options) {

	console.log('makeLoader', options)

	if (!options.resources) throw new Error('Expected options.resources');
	if (!options.component) throw new Error('Expected options.resources');
	if (!options.busy)      throw new Error('Expected options.busy');

	// validated resources
	_.each(options.resources, function(resource) {
		if (!resource.load) throw new Error('Expected resource.load');
		if (!resource.find) throw new Error('Expected resource.find');
	});

	/*
	Return the names of the resources to load
	e.g. ['user', 'comments']
	*/
	function getResourceNames() {
		return Object.keys(options.resources);
	}

	/*
	Return a map of resourceName and filtered resource/s

	@param {Map} props Component props
	@return
	e.g. {
		user:     {},
		comments: []
	}
	*/
	function getResources(props) {
		var map = {};
		var resourceNames = getResourceNames();

		_.each(resourceNames, function(resourceName) {

			var resourceDefinition = options.resources[resourceName];
			if (!resourceDefinition) throw new Error('Expected resource definition for ' + resourceName);

			// function that given all stores, will return the relevant record/s
			var find = resourceDefinition.find;
			if (!find) throw new Error('Expected resource ' + resourceName + ' to have a find')

			var stores = props.redux;
			var args = {
				stores: stores,
				props:  props
			}
			/*
			stores are in plural, so we don't really know how a resource def
			will match a store e.g. user : users
			we just delegate this to the find
			*/
			var result = find(args)
			/*
			the find might return undefined e.g. cannot find a user
			this shouldn't happen if the load is successful
			but it is possible to go an invalid url
			*/
			// console.warn('Finder for ' + resourceName + ' returned undefined');

			map[resourceName] = result;
		});

		return map;
	}

	var Loader = React.createClass({
		getInitialState: function() {
			return {loading: true};
		},

		/*
		This happens when the component is first loaded
		*/
		componentDidMount: function() {
			this.loadResources(this.props)
		},

		/*
		This happens when a route is changed
		*/
		componentWillReceiveProps: function(nextProps) {
			// log('componentWillReceiveProps', nextProps)
			this.loadResources(nextProps)
		},

		getDispatch: function() {
			return this.props.redux.dispatch;
		},

		loadResources: function(props) {
			// log('loadResources', props)

			this.setState({
				loading: true
			})

			var stores   = props.redux;
			var dispatch = this.getDispatch();

			/*
			Get actions for all the resources we need to load
			An action can be a function or an object
			*/
			var args = {
				dispatch: dispatch,
				stores:   stores,
				props:    props
			}
			var promises = _.map(options.resources, function(resource, resourceName) {
				var promise = resource.load(args);
				// var isFunction = _.isFunction(action);
				// var isObject   = _.isObject(action);
				// if (isFunction || isObject) return action;
				// console.log('PROMISE', promise)
				return promise;
				// throw new Error(resourceName + '.load must return an action');
			});

			var _this = this;

			Promise.all(promises)
				.then(function() {
					// log('action done')
					if (_this.isMounted()) {
						_this.setState({
							loading: false
						})
					}
				}, function(reason) {
					// log(reason)
				}).catch(function(error) {
					console.error(error.toString());
					console.error(error.stack);
				});
		},

		render: function() {
			// log('render')
			if (this.state.loading) {
				return React.createElement(options.busy);
			} else {
				var map = getResources(this.props)
				// only render if all things have something
				var undefinedKeys = _(map)
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
					return React.createElement('div', null, 'Cant rended component. Cannot find resources: ' + undefinedKeys);
				} else {
					// log('Rendering given component')
					var props = _.clone(this.props)
					_.extend(props, map);
					return React.createElement(options.component, props);
				}
			}
		}
	});

	var Wrapper = React.createClass({
		render: function() {
			var props = _.clone(this.props);
			var func = function(redux) {
				props.redux = redux;
				// log('Rendering Loader')
				return React.createElement(Loader, props)
			}
			// log('Rendering Connector')
			return React.createElement(connect, props, func);
		}
	});

	return Wrapper;
}

module.exports = makeLoader;
