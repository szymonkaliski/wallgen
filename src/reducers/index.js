import { fromJS } from 'immutable';

import {
  createPopulation,
  evolvePopulation,
  getGenotype
} from '../genetic/population';

const POPULATION_SIZE = 1200;
const HISTORY_SIZE = 4;

const initialState = fromJS({
  history:     [],
  download:    undefined,
  population:  createPopulation(POPULATION_SIZE),
  aspectRatio: 16/9
});

export default (state = initialState, action) => {
  if (action.type === 'EVOLVE_GENOTYPE') {
    state = state.update('history', history => history
      .unshift(getGenotype(state.get('population'), action.id))
      .setSize(Math.min(HISTORY_SIZE, history.count() + 1)));

    state = state.set('population', evolvePopulation(
      state.get('population'),
      state.get('history')));
  }

  if (action.type === 'DOWNLOAD_PHENOTYPE') {
    state = state.set('download', getGenotype(state.get('population'), action.id));
  }

  if (action.type === 'DOWNLOAD_PHENOTYPE_DONE') {
    state = state.set('download', undefined);
  }

  if (action.type === 'SET_ASPECT_RATIO') {
    state = state.set('aspectRatio', action.aspectRatio);
  }

  return state;
}
