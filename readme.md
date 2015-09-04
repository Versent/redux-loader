# Redux Loader

[ ![Codeship Status for Versent/redux-loader](https://codeship.com/projects/1c793400-34d7-0133-140c-0afba22710e8/status?branch=master)](https://codeship.com/projects/100617)

A high order component and request management utility for Redux. 

- Loads resources and passes them to the child components via props.
- Keeps tracks of requests already done and avoids duplicate requests.

## Usage

Your Redux application must include the Redux-Loader reducer. It needs to be under the `requests` key:

```js
import reduxLoader from 'redux-loader'

const allReducers = combineReducers({
  requests:        reduxLoader.reducer,
  ...
})

const store = finalCreateStore(allReducers)
```

This reducer is used for keeping track of pending and completed requests.

Then create a high order component to load the data:

```js
import reduxLoader    from 'redux-loader'
import { connect }    from 'react-redux'
import _              from 'lodash'
import Show           from './Show.jsx'
import Busy           from './Busy.jsx'

const Loader = reduxLoader.create({

  // React component to show while loading the resources
  busy:      Busy,

  // React component what will be rendered when resources are loaded
  component: Show,

  /*
  `resources` is a map with resources to load before rendering the component above
  this can be one or many.

  The component above will receive these resources as props e.g. post
  */
  resources: {

    /*
    These resources will be send to the child component via props.

    You must return a function for each resource you want to load.

    This function takes:

    - options.props
    - options.context
    - options.dispatch

    You need to pass the state you need to the Loader using connect.
    You function will be called again each time your component receives new props,
    meaning that you will always have fresh props.

    This function must return an object with keys {id, find, load}
    */
    user(options) {

      const userId = options.props.userId
      const id = `/users/${userId}`

      return {
        /*
        Loader must return an id for the current resource.
        This id will be used to keep track of request already done.
        */
        id,

        /*
        Ask to load the resource/s
        This is triggered when a request has not been done before.
        This is determined by `id` above.
        */
        load() {
          const action = actions.fetchOne(userId)
          return options.dispatch(action)
        },

        /*
        Find the resource/s in your state.

        This is called when a request has been done successfully.
        Loader uses the given `id` above to determine this.
        */
        find() {
          return _.find(options.props.users, {id: userId})
        },

      },

      /*
      You may also load several resources at once
      */
      posts(options) {
        ...
      }

    }
  }
});

// You need to pipe Loader through connect
export default connect(state => state)(Loader)
```

[Example app here](https://github.com/Versent/react-starter/blob/master/client/src/users/ShowLoader.jsx)

## How does it work

<img src="https://docs.google.com/drawings/d/1giKZMiIZYK8uOyBksbtT4OQDAivV6IVhVt5WndDb6Bs/pub?h=1048">

Heavily inspired by [Marty](http://martyjs.org/guides/fetching-state/index.html)
