import React, { Component } from 'react';
import autobind from 'react-autobind';

export default class Modal extends Component {
  constructor() {
    super();

    autobind(this);
  }

  onRequestClose() {
    if (this.props.onRequestClose) {
      this.props.onRequestClose();
    }
  }

  render() {
    const { open, children } = this.props;

    const stopEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    }

    return <div
      className={ `fixed absolute--fill bg-black-a85 transition--opacity ${open ? 'o-100 events--all' : 'o-0 events--none'}` }
      onClick={ this.onRequestClose }>
      <div className='absolute--center light-gray' onClick={ stopEvent }>
        <div className='absolute--center--children-fix'>
          { open && children }
        </div>
      </div>
    </div>;
  }
}
