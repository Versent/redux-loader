#Redux Loader

A high order component for Redux. This components loads resources and passes them to the child components via props.

## Usage

```js
import createLoader   from 'redux-loader';
import { connect }    from 'react-redux';
import Show           from './Show.jsx';
import Busy           from './Busy.jsx';

const Loader = createLoader({
	component: Show,
	busy: Busy,
	resources: {
		post: {

			find: function(options) {
				// options.props
				// options.context
				// options.dispatch <- redux dispatch function

				const id = options.context.router.state.params.id;
				return _.find(options.props.posts, {id});
			},

			load: function(options) {
				// options.props
				// options.context
				// options.dispatch <- redux dispatch function

				const id = options.context.router.state.params.id;
				const action = actions.fetchOne(postId)
				return options.dispatch(action)
			},

		}
	}
})

export default connect(state => state)(Loader);
```

### Configuration:


```js
const Loader = createLoader({

	// React component what will be rendered when resources are loaded
	component: Show,

	// React component to show while loading the resources
	busy:      Busy,

	/*
	resources is a map with resources to load
	before rendering the component above
	this can be one or many
	the component above will receive these resources as props e.g. post
	*/
	resources: {

		// this resource will be send to the child component via props
		post: {

			/*
			find is called first
			if find return an object or an array
			then the component will be rendered
			passing the resources to the child component via props
			if the resource/s is not availabel then find should return null or undefined
			*/
			find: function(options) {
				// options.props
				// options.context
				// options.dispatch
				// you need to pass the state you need to the Loader
				// using connect
				
				const userId = options.context.router.state.params.id
				return _.find(options.props.users, {id: userId})
			},

			/*
			this is triggered only when find has returned null
			*/
			load: function(options) {
				// options.props <- props from the loader will be passed here
				// options.context 
				// options.dispatch <- redux dispatch function

				const userId = options.context.router.state.params.id
				const action = actions.fetchOne(userId)
				return options.dispatch(action);
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
	component: Show,
	resources: {
		post: {
			find: function(options) {
				...
			}
			load: function(options) {
				...
			}
		},
		comments: {
			...
		}
	}
})
```
