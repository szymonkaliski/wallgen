import React, { Component } from 'react';
import autobind from 'react-autobind';
import sampleSize from 'lodash.samplesize';

import Fenotype from '../fenotype';
import createPopulation from '../../genetic/population';

import './index.css';

class Population extends Component {
  constructor() {
    super();

    autobind(this);

    const populationSize = 10000;
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

  onClickFenotype(id) {
    this.population.setBestFit(id);

    let times = 0;
    let iters = 0;
    let newChildrenCount;

    while (!(times >= 1 || iters >= 100)) {
      newChildrenCount = this.population.evolve();

      iters++;

      if (newChildrenCount > 0) {
        times++;
      }

      if (iters % 10 === 0) {
        console.log("iters: ", iters, times, this.population.lastBestFit);
      }
    }

    console.log("final iters: ", iters, this.population.lastBestFit, newChildrenCount);

    this.setState({
      populationSample: this.population.getPopulation().slice(0, 12)
    });
  }

  render() {
    return <div>
      {
        this.state.populationSample.map(({ code, id }, i) => {
          return <div className='fenotype__wrapper' key={i} onClick={() => this.onClickFenotype(id)}>
            <Fenotype code={code}/>
          </div>;
        })
      }
      <div onClick={this.onClickRandomize}>randomize</div>
    </div>;
  }
};

export default Population;
