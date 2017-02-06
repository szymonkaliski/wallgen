import flatten from 'lodash.flatten';
import times from 'lodash.times';
import randomSeed from 'random-seed';

const GENES_COUNT = 4;
const MUTATION_CHANCE = 0.001;

const { random } = randomSeed.create();
const chance = (percent) => random() < percent;

class Genotype {
  constructor(code = []) {
    this.code = code;

    this.fitness = 0;
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
    // MUTATION_CHANCE that given value will be random
    this.code = this.code.map(v => chance(MUTATION_CHANCE) ? random() : v);
  }

  crossover(partnerCode) {
    // 50/50 chance that given value comes from this genotype or partner
    // this function returns new "child"
    const childrenCode = this.code.map((v, i) => chance(0.5) ? v : partnerCode[i])

    return new Genotype(childrenCode);
  }

  setFitness(fitness) {
    this.fitness = fitness;
  }

  getCode() {
    return this.code;
  }
}

const createGenotype = () => {
  return new Genotype();
};

export default createGenotype;
