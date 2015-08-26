import React                  from 'react';
import bows                   from 'bows';
import _                      from 'lodash';
import createLoader           from '../../../index';

const baseClass = 'shared--Cats';
const PT        = React.PropTypes;
const log       = bows(baseClass);

class Comp extends React.Component {

	render() {
		return (
			<div className={`${baseClass}`}>
				<h2>Fruits</h2>
			</div>
		);
	}
}

Comp.propTypes = {

};

export default Comp;
