import keyBy from 'lodash.keyby';
import times from 'lodash.times';

import createGenotype from './genotype';

const MAX_BEST_FITS = 3;

const dist = (xs, ys) => {
  return Math.sqrt(xs
    .map((x, i) => Math.pow(x - ys[i], 2))
    .reduce((acc, diff) => acc + diff, 0));
};

const calculateFitness = (genotype, bestFits) => {
  return bestFits
    .map(bestFit => dist(bestFit.getCode(), genotype.getCode()))
    .reduce((acc, dist) => acc + dist, 0) / bestFits.length;
};

class Population {
  constructor(populationSize) {
    this.population  = times(populationSize).map(() => createGenotype());
    this.bestFits    = [];
    this.lastBestFit = 2.0;
  }

  getCodes() {
    return this.population.map(genotype => genotype.getCode());
  }

  getPopulation() {
    return this.population;
  }

  setBestFit(id) {
    const bestFit = keyBy(this.population, 'id')[id];

    this.bestFits = [ bestFit, ...this.bestFits ].slice(0, MAX_BEST_FITS);
  }

  evolve(times) {
    // add fitnesses to population
    this.population.forEach(genotype => genotype.setFitness(calculateFitness(genotype, this.bestFits)));

    // mutate every one
    this.population.forEach(genotype => genotype.mutate());

    // sort population by fitness (closer to 0 is better)
    this.population = this.population.sort((a, b) => a.fitness - b.fitness);

    // new children
    const children = this.population.slice(1, this.population.length - 1)
      .filter(genotype => genotype.fitness <= this.lastBestFit * 1.2)
      .map(genotype => this.bestFits[0].crossover(genotype.getCode()));

    // save best fit - population[1] not [0] because we want nearest generated, not the chosen one
    this.lastBestFit = Math.min(this.lastBestFit, this.population[1].fitness);

    // add children to population and remove worst-fit
    this.population = [
      ...children.map(genotype => genotype.setFitness(calculateFitness(genotype, this.bestFits))),
      ...this.population.slice(0, this.population.length - children.length)
    ].sort((a, b) => a.fitness - b.fitness);

    return children.length;
  }
}

const createPopulation = (...args) => {
  return new Population(...args);
};

export default createPopulation;
