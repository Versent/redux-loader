import reduxCrud       from 'redux-crud';
import _               from 'lodash';

const baseActions = reduxCrud.actionCreatorsFor('fruits');

const fruits = [
	{id: 1, name: 'Apple'},
	{id: 2, name: 'Strawberry'},
]

let actions = {
	fetch(color) {
		return function(dispatch, getState) {

			const promise = new Promise(function(resolve, reject) {
				setTimeout(function() {
					resolve(fruits);
				}, 1000)
			});

			promise.then(function(data) {
				const successAction = baseActions.fetchSuccess(data);
				dispatch(successAction);
			});

			return promise;
		}
	}
}

actions = _.extend(baseActions, actions);

export default actions;
