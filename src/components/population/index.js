import React, { Component } from 'react';
import autobind from 'react-autobind';
import sampleSize from 'lodash.samplesize';

import Phenotype from '../phenotype';
import createPopulation from '../../genetic/population';

import './index.css';

class Population extends Component {
  constructor() {
    super();

    autobind(this);

    const populationSize = 5000;
    this.population = createPopulation(populationSize);

    this.state = {
      populationSample: sampleSize(this.population.getPopulation(), 12)
    };
  }

  onClickRandomize() {
    this.setState({
      populationSample: sampleSize(this.population.getPopulation(), 12)
    });
  }

  onClickPhenotype(id) {
    this.population.setBestFit(id);
    this.population.evolve();

    this.setState({
      populationSample: this.population.getPopulation().slice(0, 12)
    });
  }

  render() {
    return <div>
      {
        this.state.populationSample.map(({ code, id }, i) => {
          return <div className='phenotype__wrapper' key={i} onClick={() => this.onClickPhenotype(id)}>
            <Phenotype code={code}/>
          </div>;
        })
      }
      <div onClick={this.onClickRandomize}>randomize</div>
    </div>;
  }
};

export default Population;
