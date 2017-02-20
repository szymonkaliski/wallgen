import React, { Component } from 'react';
import autobind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  downloadPhenotype,
  evolveGenotype
} from '../../actions';

import Phenotype from '../phenotype';

import { DISPLAY_PER_PAGE } from '../../constants';

const { round } = Math;

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

  componentWillReceiveProps(nextProps) {
    if (!nextProps.population.equals(this.props.population)) {
      this.setState({ offset: 0 });
    }
  }

  onClickPhenotype(id) {
    this.props.evolveGenotype(id);
  }

  downloadPhenotype(id) {
    this.props.downloadPhenotype(id);
  }

  render() {
    const { population, aspectRatio } = this.props;
    const { offset }                  = this.state;

    return <div>
      <div className='mw9 center pb3'>
        <div className='cf'>
          {
            population.slice(offset, offset + DISPLAY_PER_PAGE).map((genotype, i) => {
              const id = genotype.get('id');

              return <div className='fl w-100 w-third-ns pa2' key={i}>
                <div className='ba b--gray'>
                  <div className='pa1'>
                    <Phenotype key={ i } code={ genotype.get('code') } aspect={ aspectRatio }/>
                  </div>

                  <div className='bt flex items-center b--gray'>
                    <div className='pa2 f6 tc w-50 pointer bg-animate hover-white hover-bg-gray br b--gray' onClick={ () => this.onClickPhenotype(id) }>Evolve</div>
                    <div className='pa2 f6 tc w-50 pointer bg-animate hover-white hover-bg-gray' onClick={ () => this.downloadPhenotype(id) }>Download</div>
                  </div>
                </div>
              </div>;
            })
          }
        </div>
      </div>

      <div className='flex items-center justify-center pb3'>
        <div className='w-120px pa2 tc b--gray pointer bg-animate hover-white hover-bg-gray ba border-box' onClick={ () => this.onClickMoveOffset(-1) }>Previous</div>
        <div className='w-120px pa2 tc'>{ round(offset / DISPLAY_PER_PAGE) + 1 } / { round(population.count() / DISPLAY_PER_PAGE) }</div>
        <div className='w-120px pa2 tc b--gray pointer bg-animate hover-white hover-bg-gray ba border-box' onClick={ () => this.onClickMoveOffset(+1) }>Next</div>
      </div>
    </div>;
  }
};

const mapStateToProps = (state) => ({
  population:  state.get('population'),
  aspectRatio: state.get('aspectRatio')
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  downloadPhenotype,
  evolveGenotype
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Population);
