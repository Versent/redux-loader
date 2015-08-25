import '../node_modules/basscss/css/basscss.css';

import React                             from 'react';
import thunkMiddleware                   from 'redux-thunk';
import loggerMiddleware                  from 'redux-logger';
import { applyMiddleware }               from 'redux';
import { combineReducers }               from 'redux';
import { createStore }                   from 'redux';
import { Provider }                      from 'react-redux';
import reduxCrud                         from 'redux-crud';
import { Redirect, Router, Route }       from 'react-router';
import HashHistory                       from 'react-router/lib/HashHistory';

import Cats               from './Cats.jsx';
import Dogs               from './Dogs.jsx';
import NotFound           from './NotFound.jsx';

localStorage.debug = true;
const history       = new HashHistory();

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware, // lets us dispatch() functions
  loggerMiddleware // neat middleware that logs actions
)(createStore);

const allReducers = combineReducers({
  posts:     reduxCrud.reducersFor('posts'),
  comments:  reduxCrud.reducersFor('comments'),
});

const store = createStoreWithMiddleware(allReducers);

class AppComponent extends React.Component {
  render() {
    return (
      <section className='container'>
        <a href="#/cats">Cats</a> <a href="#/dogs">Dogs</a>
        {/* this will render the child routes */}
        {this.props.children}
      </section>
    );
  }
}

class AppRouter extends React.Component {
  render() {
    return (
      <Router {...this.props}>
        <Route component={AppComponent} >
          <Route path='/' component={Cats} />
          <Route path='/cats' component={Cats} />
          <Route path='/dogs' component={Dogs} />
          <Route path='*' component={NotFound} />
        </Route>
      </Router>
    );
  }
}

AppRouter.propTypes = {
  history: React.PropTypes.object.isRequired,
};

const mountNode = document.getElementById('app');
React.render(
  <Provider store={store}>
    {() => <AppRouter history={history} /> }
  </Provider>,
  mountNode
);
