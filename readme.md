#Redux Loader

A high order component for Redux. This components loads resources and passes them to the child components via props.

## Usage

```js

var createLoader = require('redux-loader')

var Loader = createLoader({
	component: Show,
	resources: {
		post: {
			load: function(props) {
				// props from the loader will be passed here
				var postId = props.params.postId
				return fetch(postId)
			},
			find: function(props, stores) {
				// props will be passed here
				// also all redux stores
				var postId = props.params.postId
				return _.find(stores.posts, {postId})
			}
		}
	}
})

module.exports = Loader
```

Configuration:

```
var Loader = createLoader({

	// React component what will be rendered when resources are loaded
	component: Show,

	// React component to show while loading the resources
	busy:      Busy,

	// resources is a map with resources to load
	// before rendering the component above
	// this can be one or many
	// the component above will receive these resources as props e.g. post
	resources: {

		// this resource will be send to the child component via props
		post: {

			// this function is triggered when the loader first renders
			// and each time the loader receives new props
			load: function(props) {
				// props from the loader will be passed here
				// your load function must return a promise
				// if the promise is pending, then the loader will show the 'busy' component
				// when all promises are resolved then the loader will call 'find'

				var postId = props.params.postId
				return fetch(postId)
			},

			// find is called when all promises returned by 'load' are resolved
			// this function should return the resources to pass to the child component
			// via props
			find: function(props, stores) {
				// props will be passed here
				// also all redux stores
				var postId = props.params.postId
				return _.find(stores.posts, {postId})
			}
		}
	}
})
```

You may also load several resources at once:

```js
var createLoader = require('redux-loader')

var Loader = createLoader({
	component: Show,
	resources: {
		post: {
			load: function(props) {
				...
			},
			find: function(props, stores) {
				...
			}
		},
		comments: {
			...
		}
	}
})
```
