import React                  from 'react';
import bows                   from 'bows';
import _                      from 'lodash';
import createLoader           from '../../../index';
import Index                  from './Index.jsx';
import Busy                   from '../shared/Busy.jsx';

const Loader = createLoader({
	component: Index,
	busy: Busy,
	resources: {
		cats: {
			load: function(options) {
				console.log('options', options)
				// options.dispatch <- redux dispatch function
				// options.stores 
				// options....      <- other props passed to the Loader

				var action = fetch(options.color);
				return options.dispatch(action);
			},
			find: function(options) {
				// options.props
				// options.stores

				var postId = props.params.postId
				return _.find(stores.posts, {postId})
			}
		}
	}
});

export default Loader;
