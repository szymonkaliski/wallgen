import { fromJS } from 'immutable';

import {
  createPopulation,
  evolvePopulation,
  getGenotype
} from '../genetic/population';

const POPULATION_SIZE = 1200;

const initialState = fromJS({
  history:    [],
  population: createPopulation(POPULATION_SIZE)
});

export default (state = initialState, action) => {
  if (action.type === 'EVOLVE_GENOTYPE') {
    state = state.update('history', history => history.push(getGenotype(state.get('population'), action.id)));
    state = state.set('population', evolvePopulation(state.get('population'), state.get('history')));
  }

  return state;
}
