var React             = require('react')
var bows              = require('bows')
var _                 = require('lodash')
var joi               = require('joi')
var Connector         = require('redux/react').Connector

var PT                = React.PropTypes
var log               = bows('app.Loader')

/*
Creates a Loader Component and a Wrapper
Show a spinner when loading the resources

The specified resources will be passed to the child component
as props.

@param {Class} options.component React component to show when done
@param {Map} options.resources A map with resources to fetch

Example usage:

var Loader = app.makeLoader({
	component: Show,
	resources: {
		match: {
			load: function(props) {
				// props from the loader will be passed here
				var matchId = props.params.matchId;
				return fetch(matchId)
			},
			find: function(props, stores) {
				// props will be passed here
				// also all redux stores
				var id = props.params.matchId
				return _.find(stores.matches, {id})
			}
		}
	}
});

*/
function makeLoader(options) {

	var schema = {
		resources: joi.object().required(),
		component: joi.func().required(),
		busy:      joi.func().required()
	};

	joi.assert(options, schema);

	// validated resources
	var resourcesSchema = joi.object().keys({
		load:  joi.func().required(),
		find: joi.func().required()
	});

	_.each(options.resources, function(resource) {
		joi.assert(resource, resourcesSchema);
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
			/*
			stores are in plural, so we don't really know how a resource def
			will match a store e.g. user : users
			we just delegate this to the find
			*/
			var result = find(props, stores)
			/*
			the find might return undefined e.g. cannot find a user
			this shouldn't happen if the load is successful
			but it is possible to go an invalid url
			*/
			console.warn('Finder for ' + resourceName + ' returned undefined');

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
			});

			/*
			Get actions for all the resources we need to load
			An action can be a function or an object
			*/
			var actions = _.map(options.resources, function(resource, resourceName) {
				var action = resource.load(props);
				var isFunction = _.isFunction(action);
				var isObject   = _.isObject(action);
				if (isFunction || isObject) return action;
				throw new Error(resourceName + '.load must return an action');
			});

			var dispatch = this.getDispatch();

			// TODO: trigger all actions
			// and compose the promises
			/*
			When a load is already done then load
			will return a resolved promise immediatelly
			*/

			var _this = this;

			dispatch(actions[0])
				.then(function() {
					log('action done')
					_this.setState({
						loading: false
					})
				}, function(reason) {
					log(reason)
				}).catch(function(error) {
					console.error(error.stack);
					console.error(error.toString());
				});
		},

		render: function() {
			log('render')
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
					log('Rendering error div')
					return React.createElement('div', null, 'Cant rended component. Cannot find resources: ' + undefinedKeys);
				} else {
					log('Rendering given component')
					_.extend(this.props, map);
					return React.createElement(options.component, this.props);
				}
			}
		}
	});

	var Wrapper = React.createClass({
		render: function() {
			var props = this.props;
			var func = function(redux) {
				props.redux = redux;
				log('Rendering Loader')
				return React.createElement(Loader, props)
			}
			log('Rendering Connector')
			return React.createElement(Connector, props, func);
		}
	});

	return Wrapper;
}

module.exports = makeLoader;
