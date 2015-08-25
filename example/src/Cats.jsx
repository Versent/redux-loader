import React                  from 'react';
import bows                   from 'bows';
import _                      from 'lodash';
import createLoader           from '../../index';

const baseClass = 'shared--Cats';
const PT        = React.PropTypes;
const log       = bows(baseClass);

class Busy extends React.Component {
	render() {
		return (
			<span>Loading</span>
		);
	}
}

class Comp extends React.Component {

  render() {
    return (
      <div className={`${baseClass}`}>
        <h2>Cats</h2>
      </div>
    );
  }
}

Comp.propTypes = {

};

const Loader = createLoader({
	component: Comp,
	busy: Busy,
	resources: {
        cats: {
            load: function(options) {
                // options.props    <- props from the loader will be passed here
                // options.dispatch <- redux dispatch function
                // options.stores 

                var postId = props.params.postId
                var action = fetch(postId)
                return options.dispatch(action)
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
