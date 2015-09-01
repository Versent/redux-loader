var React                = require('react');
var PT                   = React.PropTypes
var _                    = require('lodash');
// var connect           = require('react-redux').connect;

var assertConfig         = require('./assertConfig');
var findAndLoadResources = require('./findAndLoadResources');
var findResources        = require('./findResources');


/*
@param {Class} config.component React component to show when done
@param {Class} config.busy React component to show when loading
@param {Map}   config.resources A map with resources to fetch
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
    Triggered when the component is first loaded
    */
    componentDidMount: function() {
      this.processResources(this.props, this.context)
    },

    /*
    Triggered when on routing changes
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
      var resourcesMap     = findAndLoadResources(args);
      var resourcesMapKeys = Object.keys(resourcesMap);
      var loading          = true;

      /*
      if resourcesMapKeys is empty, then some resources
      are still loading
      */
      if (resourcesMapKeys.length > 0) {
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
