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

import FruitsIndex               from './fruits/IndexLoader.jsx';
import PeopleIndex               from './people/Index.jsx';
import NotFound                  from './NotFound.jsx';

localStorage.debug = true;
const history       = new HashHistory();

const allReducers = combineReducers({
	fruits:  reduxCrud.reducersFor('fruits'),
	people:  reduxCrud.reducersFor('people'),
});

const createStoreWithMiddleware = applyMiddleware(
	thunkMiddleware, // lets us dispatch() functions
	loggerMiddleware // neat middleware that logs actions
)(createStore);

const store = createStoreWithMiddleware(allReducers);

class AppComponent extends React.Component {
	render() {
		return (
			<section className='container'>
				<a href="#/fruits">Fruits</a> <a href="#/people">People</a>
				{/* this will render the child routes */}
				{this.props.children}
			</section>
		);
	}
}

class FruitsIndexWithProps extends React.Component {
	render() {
		return (
			<FruitsIndex color='red' />
		)
	}
}

class PeopleIndexWithProps extends React.Component {
	render() {
		return (
			<PeopleIndex sex='female' />
		)
	}
}

class AppRouter extends React.Component {
	render() {
		return (
			<Router {...this.props}>
				<Route component={AppComponent} >
					<Route path='/' component={FruitsIndexWithProps} />
					<Route path='/fruits' component={FruitsIndexWithProps} />
					<Route path='/people' component={PeopleIndexWithProps} />
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
