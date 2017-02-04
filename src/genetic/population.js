import times from 'lodash.times';

import createGenotype from './genotype';

const dist = (xs, ys) => {
  return Math.sqrt(xs
    .map((x, i) => {
      return Math.pow(x - ys[i], 2);
    })
    .reduce((acc, diff) => {
      return acc + diff;
    }, 0));
};

const normalize = (xs) => {
  const max = xs.reduce((acc, x) => Math.max(x, acc), 0);
  return xs.map(x => x / max);
};

class Population {
  constructor(populationSize) {
    this.population = times(populationSize).map(() => {
      return createGenotype();
    });
  }

  getPopulationCodes() {
    return this.population.map(genotype => genotype.getCode());
  }

  setBestFit(idx) {
    const bestFit = this.population[idx].getCode();

    // calculate fitnesses as n-dim distance from best fit
    this.fitnesses = this.population.map((genotype, i) => dist(bestFit, genotype.getCode()));
    // normalize fitnesses
    this.fitnesses = normalize(this.fitnesses);
    // best fit should be 1.0 not 0.0
    this.fitnesses = this.fitnesses.map(x => 1 - x);

    // TODO: evolve
    console.log({ fitnesses: this.fitnesses });
  }

  evolve() {

  }
}

const createPopulation = (...args) => {
  return new Population(...args);
};

export default createPopulation;
