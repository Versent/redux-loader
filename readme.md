#Redux Loader

A high order component for Redux. This components loads resources and passes them to the child components via props.

## Usage

```js
import createLoader   from 'redux-loader';
import { connect }    from 'react-redux';
import Show           from './Show.jsx';
import Busy           from './Busy.jsx';

const Loader = createLoader({
	busy: Busy,
	component: Show,
	resources: {
		post: function(options) {
			// options.props
			// options.context
			// options.dispatch <- redux dispatch function

			const id = options.context.router.state.params.id;

			return {
				id: id,

				find: function() {
					return _.find(options.props.posts, {id});
				},

				load: function() {
					const action = actions.fetchOne(postId)
					return options.dispatch(action)
				},
			}

		}
	}
})

export default connect(state => state)(Loader);
```

### Configuration:


```js
const Loader = createLoader({

	// React component to show while loading the resources
	busy:      Busy,

	// React component what will be rendered when resources are loaded
	component: Show,

	/*
	resources is a map with resources to load
	before rendering the component above
	this can be one or many
	the component above will receive these resources as props e.g. post
	*/
	resources: {

		
		/*
		This resource will be send to the child component via props

		You must return a function for each resource you want to load
		This function takes:

		- options.props
		- options.context
		- options.dispatch

		You need to pass the state you need to the Loader using connect.
		You function will be called again each time your component receives new props,
		meaning that you will always have fresh props.

		This function must return an object with keys {id, find, load}
		*/
		post: function(options) {

			var postId = options.props.postId;
			var id = '/posts/' + postId;

			return {
				/*
				Loader must return an id for the current resource
				The id is just used to check for loaders doing too many request for the same resource.
				*/
				id: id,

				/*
				find the resource/s in your state. This function is called before load.

				If find returns an object or an array then the component will be rendered,
				passing the resources to the child component via props

				If find returns null or undefined then load will be called. If your find function returns null too many times then the loader will shortcircuit and throw an error.
				*/
				find: function() {
					const userId = options.context.router.state.params.id
					return _.find(options.props.users, {id: userId});
				},

				/*
				Ask to load the resource/s
				This is triggered only when find has returned null
				*/
				load: function() {
					const action = actions.fetchOne(postId);
					return options.dispatch(action);
				}
			}

		}
	}
});

// You need to pipe Loader through connect
export default connect(state => state)(Loader);
```

You may also load several resources at once:

```js
const createLoader = require('redux-loader')

const Loader = createLoader({
	busy:      Busy,
	component: Show,
	resources: {
		post: function (options) {...},
		comments: function (options) {...}
	}
})
```

[Example app here](https://github.com/Versent/react-starter/blob/master/client/src/users/ShowLoader.jsx)

## How does it work

<img src="https://docs.google.com/drawings/d/1giKZMiIZYK8uOyBksbtT4OQDAivV6IVhVt5WndDb6Bs/pub?w=960&amp;h=720">

Heavily inspired by [Marty](http://martyjs.org/guides/fetching-state/index.html)
