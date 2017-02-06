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

    this.bestFits = [];
    this.lastBestFit = 0;
  }

  getCodes() {
    return this.population.map(genotype => genotype.getCode());
  }

  setBestFit(idx) {
    // this.bestFit = this.population[idx];
    const maxBestFits = 4;
    this.bestFits = [ this.population[idx], ...this.bestFits ].slice(0, maxBestFits);
  }

  evolve(times) {
    // calculate fitnesses as n-dim distance from best fit
    let fitnesses = this.population.map((genotype, i) => {
      // return dist(this.bestFit.getCode(), genotype.getCode())

      const dists = this.bestFits.map(bestFit => dist(bestFit.getCode(), genotype.getCode()));

      return dists.reduce((acc, dist) => acc + dist, 0) / dists.length;
    });

    // normalize fitnesses
    // fitnesses = normalize(fitnesses);

    // best fit should be 1.0 not 0.0
    fitnesses = fitnesses.map(v => v === 0.0 ? Infinity : 1.0 / v);

    // add fitnesses to population
    this.population.forEach((genotype, i) => genotype.setFitness(fitnesses[i]));

    // mutate every one
    this.population.forEach(genotype => genotype.mutate());

    // sort population by fitness
    this.population = this.population.sort((a, b) => b.fitness - a.fitness);

    // make new children
    // const cutoff = max * 0.8;
    // const childrenCount = this.population.filter(({ fitness }) => fitness > cutoff);
    const childrenCount = Math.round(this.population.length / 2);

    // const children = times(childrenCount).map((_, i) => {
    //   return this.bestFits[0].crossover(this.population[i + 1]);
    // });

    const children = this.population.slice(1, this.population.length)
      .filter(genotype => genotype.fitness >= Math.max(this.lastBestFit * 0.9, 0.75))
      .map(genotype => this.bestFits[0].crossover(genotype.getCode()));

    // save best fit
    this.lastBestFit = this.population[1].fitness;

    // add children to population and remove worst-fit
    this.population = [
      ...children,
      ...this.population.slice(
        0,
        this.population.length - children.length
      )
    ];

    if (children.length > 0) {
      console.log(children.length, fitnesses.sort((a, b) => b - a).slice(0, 20));
    }

    return children.length;
  }
}

const createPopulation = (...args) => {
  return new Population(...args);
};

export default createPopulation;
