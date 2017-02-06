import React, { Component } from 'react';
import times from 'lodash.times';

import Fenotype from '../fenotype';
import createPopulation from '../../genetic/population';

class Population extends Component {
  constructor() {
    super();

    const populationSize = 10000;
    this.population = createPopulation(populationSize);

    this.state = {
      populationCodes: this.population.getCodes().slice(0, 12)
    };
  }

  onClickFenotype(idx) {
    this.population.setBestFit(idx);

    let times = 0;
    let iters = 0;
    let newChildrenCount;

    while (!(times >= 1 || iters > 10000)) {
      newChildrenCount = this.population.evolve(100);

      iters++;

      if (newChildrenCount > 0) {
        times++;
      }

      if (iters % 10 === 0) {
        console.log("iters: ", iters, times, this.population.lastBestFit);
      }
    }

    console.log("final iters: ", iters, this.population.lastBestFit);

    this.setState({
      populationCodes: this.population.getCodes().slice(newChildrenCount, newChildrenCount + 12)
    });
  }

  render() {
    return <div>
      {
        this.state.populationCodes.map((code, i) => {
          return <div key={i} onClick={() => this.onClickFenotype(i)} style={{ display: 'inline-block' }}>
            {i}
            <Fenotype code={code}/>
          </div>;
        })
      }
    </div>;
  }
};

export default Population;
