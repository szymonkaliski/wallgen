import React, { Component } from 'react';

import Fenotype from '../fenotype';
import createPopulation from '../../genetic/population';

const population = createPopulation(10);

class Population extends Component {
  onClickFenotype(idx) {
    console.log({ idx })
    population.setBestFit(idx);
  }

  render() {
    return <div>
      {
        population.getPopulationCodes().map((code, i) => {
          return <div key={i} onClick={() => this.onClickFenotype(i)}>
            {i}
            <Fenotype code={code}/>
          </div>;
        })
      }
    </div>;
  }
};

export default Population;
