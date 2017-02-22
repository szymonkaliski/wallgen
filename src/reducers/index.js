import { fromJS } from 'immutable';

import {
  createPopulation,
  getGenotype
} from '../genetic/population';

import { POPULATION_SIZE } from '../constants';

const initialState = fromJS({
  evolving:       false,
  history:        [],
  historyVisible: false,
  download:       undefined,
  population:     createPopulation(POPULATION_SIZE),
  aspectRatio:    16/9
});

export default (state = initialState, action) => {
  if (action.type === 'EVOLVE_GENOTYPE_START') {
    state = state.set('evolving', true);
  }

  if (action.type === 'EVOLVE_GENOTYPE_DONE') {
    state = state
      .set('population', action.population)
      .set('history', action.history)
      .set('evolving', false);
  }

  if (action.type === 'DOWNLOAD_PHENOTYPE') {
    state = state.set('download', getGenotype(state.get('population').concat(state.get('history')), action.id));
  }

  if (action.type === 'DOWNLOAD_PHENOTYPE_DONE') {
    state = state.set('download', undefined);
  }

  if (action.type === 'SET_ASPECT_RATIO') {
    state = state.set('aspectRatio', action.aspectRatio);
  }

  if (action.type === 'TOGGLE_HISTORY_VISIBLE') {
    state = state.update('historyVisible', historyVisible => !historyVisible);
  }

  return state;
}
