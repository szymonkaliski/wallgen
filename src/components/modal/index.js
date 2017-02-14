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
    if (!this.props.open) {
      return null;
    }

    const stopEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
    }

    return <div className='fixed absolute--fill bg-black-a80' onClick={this.onRequestClose}>
      <div className='absolute--center light-gray' onClick={stopEvent}>
        <div className='absolute--center--children-fix'>
          { this.props.children }
        </div>
      </div>
    </div>;
  }
}
