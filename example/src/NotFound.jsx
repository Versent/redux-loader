import React                  from 'react';
import bows                   from 'bows';
import _                      from 'lodash';

const baseClass = 'shared--NotFound';
const PT        = React.PropTypes;
const log       = bows(baseClass);

class Comp extends React.Component {

  render() {
    return (
      <div className={`${baseClass}`}>
        <h2>Not found</h2>
      </div>
    );
  }
}

Comp.propTypes = {
};

export default Comp;
