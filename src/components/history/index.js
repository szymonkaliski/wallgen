import React, { Component } from 'react';
import autobind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  downloadPhenotype,
  toggleHistoryVisible
} from '../../actions';

import Modal from '../modal';
import Phenotype from '../phenotype';

class History extends Component {
  constructor() {
    super();

    autobind(this);

    this.state = {
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    this.onResize();

    window.addEventListener('resize', this.onResize);
  }

  componentWillUmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.setState({
      width: window.innerWidth
    });
  }

  downloadPhenotype(id) {
    this.props.downloadPhenotype(id);
  }

  render() {
    const {
      aspectRatio,
      history,
      historyVisible,
      toggleHistoryVisible
    } = this.props;

    const { width } = this.state;

    return <Modal open={ historyVisible } onRequestClose={ toggleHistoryVisible }>
      <div className='cf' style={{ width, height: "auto" }}>
        { history.count() === 0 && <div className='tc'>History is empty - nothing evolved yet...</div> }
        {
          history.map((genotype, i) => {
            return <div className='fl w-100 w-third-ns pa2' key={ i }>
              <div className='ba b--gray'>
                <div className='pa1'>
                  <Phenotype key={ i } code={ genotype.get('code') } aspect={ aspectRatio }/>
                </div>

                <div
                  className='bt b--gray pa2 f6 tc pointer bg-animate hover-white hover-bg-gray'
                  onClick={ () => this.downloadPhenotype(genotype.get('id')) }>
                  Download
                </div>
              </div>
            </div>;
          })
        }
      </div>
    </Modal>;
  }
};

const mapStateToProps = (state) => ({
  aspectRatio:    state.get('aspectRatio'),
  history:        state.get('history'),
  historyVisible: state.get('historyVisible')
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  downloadPhenotype,
  toggleHistoryVisible
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(History);
