import keyBy from 'lodash.keyby';
import randomSeed from 'random-seed';
import times from 'lodash.times';

import createGenotype from './genotype';

const MAX_BEST_FITS = 10;

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

const prop = (key) => (obj) => obj[key];

const { random } = randomSeed.create();

const rouletteIdx = (normalizedFitnesses, sumFitnesses) => {
  const value = random() * sumFitnesses;

  return normalizedFitnesses.reduce((acc, fitness, idx) => {
    if (!acc.idx) {
      const newValue = acc.value - fitness;

      return {
        value: newValue,
        idx:   newValue <= 0 ? idx : acc.idx
      };
    }
    else {
      return acc;
    }
  }, { value, idx: undefined }).idx;
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

  evolve() {
    let newPopulation = [];

    // add fitnesses to population (the smaller the better)
    this.population.forEach(genotype => genotype.setFitness(calculateFitness(genotype, this.bestFits)));

    // normalize and sum fitnesses
    const maxFitnesses        = Math.max(...this.population.map(prop('fitness')));
    const normalizedFitnesses = this.population.map(({ fitness }) => 1 - fitness / maxFitnesses);
    const sumFitnesses        = normalizedFitnesses.reduce((acc, fitness) => acc + fitness, 0);

    // roulette
    while (newPopulation.length < this.population.length) {
      const parentAIdx = rouletteIdx(normalizedFitnesses, sumFitnesses);
      const parentBIdx = rouletteIdx(normalizedFitnesses, sumFitnesses);

      const parentA    = this.population[parentAIdx];
      const parentB    = this.population[parentBIdx];

      if (parentAIdx !== parentBIdx) {
        const child = parentA.crossover(parentB);

        // mutate and re-calculate fitness
        child.mutate();
        child.setFitness(calculateFitness(child, this.bestFits));

        newPopulation.push(child);
      }
      else {
        // in rare chance both random idxs are the same
        // just let the parent live for next iteration
        newPopulation.push(parentA);
      }
    }

    // new population sorted by fitness (again, smaller is better)
    this.population = newPopulation.sort((a, b) => a.fitness - b.fitness);
  }
}

const createPopulation = (...args) => {
  return new Population(...args);
};

export default createPopulation;
