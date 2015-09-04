var React                = require('react')
var PT                   = React.PropTypes
var _                    = require('lodash')
// var connect           = require('react-redux').connect

var assertConfig         = require('./assertConfig')
var findOrLoadAll        = require('./findOrLoadAll')

/*
@param {Class} config.component React component to show when done
@param {Class} config.busy React component to show when loading
@param {Map}   config.resources A map with resources to fetch
*/
function createLoader(config) {
  assertConfig(config)
  var helper = {}

  var Loader = React.createClass({

    renderLoading: function() {
      return React.createElement(config.busy)
    },

    renderComponent: function(resourcesMap) {
      console.log('resourcesMap', resourcesMap)
      var props = _.clone(this.props)
      _.extend(props, resourcesMap)
      return React.createElement(config.component, props)
    },

    render: function() {

      var args = {
        config:  config,
        context: this.context,
        helper:  helper,
        props:   this.props,
      }

      var resourcesMap = findOrLoadAll(args)
      var allLoaded = _.every(resourcesMap, function(resource) {
        return resource != null
      })

      if (allLoaded) {
        return this.renderComponent(resourcesMap)
      } else {
        return this.renderLoading()
      }

    },

  })

  return Loader
}

module.exports = createLoader
