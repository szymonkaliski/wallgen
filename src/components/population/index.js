import React, { Component } from 'react';
import autobind from 'react-autobind';

import Phenotype from '../phenotype';
import createPopulation from '../../genetic/population';

import './index.css';

const { round } = Math;

const DISPLAY_PER_PAGE = 12;

class Population extends Component {
  constructor() {
    super();

    autobind(this);

    const populationSize = 5000;
    this.population = createPopulation(populationSize);

    this.state = {
      offset:     0,
      population: this.population.getPopulation()
    };
  }

  onClickMoveOffset(direction) {
    const { population, offset } = this.state;

    const newOffset = (offset + direction * DISPLAY_PER_PAGE) % population.length;

    this.setState({
      offset: newOffset < 0 ? population.length - DISPLAY_PER_PAGE : newOffset
    });
  }

  onClickPhenotype(id) {
    this.population.setBestFit(id);
    this.population.evolve();

    this.setState({
      offset:     0,
      population: this.population.getPopulation()
    });
  }

  render() {
    const { population, offset } = this.state;

    return <div>
      <div className='mw9 center ph3-ns'>
        <div className='cf ph2-ns'>
        {
          population.slice(offset, offset + DISPLAY_PER_PAGE).map(({ code, id }, i) => {
            return <div className='fl w-100 w-third-ns pa2' key={i} onClick={() => this.onClickPhenotype(id)}>
              <Phenotype code={code} aspect={16/9}/>
            </div>;
          })
        }
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <div className='w-120px pa2 tc pointer bg-animate hover-white hover-bg-black ba border-box' onClick={() => this.onClickMoveOffset(-1)}>Previous</div>
        <div className='w-120px pa2 tc'>{ round(offset / DISPLAY_PER_PAGE) + 1 } / { round(population.length / DISPLAY_PER_PAGE) }</div>
        <div className='w-120px pa2 tc pointer bg-animate hover-white hover-bg-black ba border-box' onClick={() => this.onClickMoveOffset(+1)}>Next</div>
      </div>
    </div>;
  }
};

export default Population;
