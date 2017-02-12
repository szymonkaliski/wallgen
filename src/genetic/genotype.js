import flatten from 'lodash.flatten';
import randomSeed from 'random-seed';
import times from 'lodash.times';
import uuid from 'uuid';
import { fromJS } from 'immutable';

const GENES_COUNT     = 4;
const MUTATION_CHANCE = 0.001;

const { random } = randomSeed.create();
const chance = (percent) => random() < percent;

const randomCode = () => {
  return flatten(times(GENES_COUNT).map(() => {
    const x           = random();
    const y           = random();
    const distanceMod = random();
    const h           = random();
    const s           = random();
    const v           = random();

    return [ x, y, distanceMod, h, s, v ];
  }));
};

export const createGenotype = (code = randomCode()) => {
  return fromJS({
    code,
    id: uuid.v4()
  });
};

export const crossover = (parentA, parentB) => {
  // 50/50 chance that given value comes from this genotype or partner
  // this function returns new "child"
  const code = parentA.get('code').map((v, i) => chance(0.5) ? v : parentB.getIn([ 'code', i ]));

  return createGenotype(code);
};

export const mutate = (genotype) => {
  // MUTATION_CHANCE that given value will be random
  const code = genotype.get('code').map(v => chance(MUTATION_CHANCE) ? random() : v);

  return createGenotype(code);
};
