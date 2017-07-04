import { fromJS } from 'immutable';

import { createPopulation, getGenotype } from '../genetic/population';

import { POPULATION_SIZE } from '../constants';

const initialState = fromJS({
  isEvolving: false,
  history: [],
  historyVisible: false,
  infoVisible: false,
  download: undefined,
  population: createPopulation(POPULATION_SIZE),
  aspectRatio: 16 / 9
});

export default (state = initialState, action) => {
  if (action.type === 'EVOLVE_GENOTYPE_START') {
    state = state.set('isEvolving', true);
  }

  if (action.type === 'EVOLVE_GENOTYPE_DONE') {
    state = state.set('population', action.population).set('history', action.history).set('isEvolving', false);
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

  if (action.type === 'TOGGLE_INFO_VISIBLE') {
    state = state.update('infoVisible', infoVisible => !infoVisible);
  }

  return state;
};
