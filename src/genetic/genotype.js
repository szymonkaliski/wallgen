import flatten from 'lodash.flatten';
import times from 'lodash.times';
import randomSeed from 'random-seed';

const GENES_COUNT = 10;

const { random } = randomSeed.create();

class Genotype {
  constructor() {
    this.code = [];

    this.generate();
  }

  generate() {
    this.code = flatten(times(GENES_COUNT).map(() => {
      const x           = random();
      const y           = random();
      const distanceMod = random();
      const h           = random();
      const s           = random();
      const v           = random();

      return [ x, y, distanceMod, h, s, v ];
    }));
  }

  mutate() {
    // TODO
  }

  crossover() {
    // TODO
  }

  getCode() {
    return this.code;
  }
}

const createGenotype = () => {
  return new Genotype();
};

export default createGenotype;
