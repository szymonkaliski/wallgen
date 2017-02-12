import React, { Component } from 'react';
import autobind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { evolveGenotype } from '../../actions';

import Phenotype from '../phenotype';

import './index.css';

const { round } = Math;

const DISPLAY_PER_PAGE = 12;

class Population extends Component {
  constructor() {
    super();

    autobind(this);

    this.state = {
      offset: 0
    };
  }

  onClickMoveOffset(direction) {
    const { population } = this.props;
    const { offset }     = this.state;

    const newOffset = (offset + direction * DISPLAY_PER_PAGE) % population.count();

    this.setState({
      offset: newOffset < 0 ? population.count() - DISPLAY_PER_PAGE : newOffset
    });
  }

  onClickPhenotype(id) {
    this.props.evolveGenotype(id);
  }

  render() {
    const { population } = this.props;
    const { offset }     = this.state;

    return <div>
      <div className='mw9 center ph3-ns'>
        <div className='cf ph2-ns'>
        {
          population.slice(offset, offset + DISPLAY_PER_PAGE).map(genotype => {
            const id = genotype.get('id');

            return <div className='fl w-100 w-third-ns pa2' key={id} onClick={() => this.onClickPhenotype(id)}>
              <Phenotype code={genotype.get('code').toJS()} aspect={16/9}/>
            </div>;
          })
        }
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <div className='w-120px pa2 tc pointer bg-animate hover-white hover-bg-black ba border-box' onClick={() => this.onClickMoveOffset(-1)}>Previous</div>
        <div className='w-120px pa2 tc'>{ round(offset / DISPLAY_PER_PAGE) + 1 } / { round(population.count() / DISPLAY_PER_PAGE) }</div>
        <div className='w-120px pa2 tc pointer bg-animate hover-white hover-bg-black ba border-box' onClick={() => this.onClickMoveOffset(+1)}>Next</div>
      </div>
    </div>;
  }
};

const mapStateToProps = (state) => ({
  population: state.get('population')
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ evolveGenotype }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Population);
