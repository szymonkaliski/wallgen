import { fromJS } from 'immutable';
import { fromJSON, toJSON } from 'transit-immutable-js';

import EvolutionWorker from '../genetic/evolution.worker.js';

export const evolveGenotypeStart = (id) => ({
  type: 'EVOLVE_GENOTYPE_START',
  id
});

export const evolveGenotypeDone = (population, history) => ({
  type: 'EVOLVE_GENOTYPE_DONE',
  population,
  history
});

export const evolveGenotype = (id) => (dispatch, getState) => {
  dispatch(evolveGenotypeStart(id));

  const evolutionWorker = new EvolutionWorker();

  evolutionWorker.postMessage(toJSON(fromJS({
    evolveId:   id,
    history:    getState().get('history'),
    population: getState().get('population')
  })));

  evolutionWorker.addEventListener('message', event => {
    const data = fromJSON(event.data);

    dispatch(evolveGenotypeDone(
      data.get('population'),
      data.get('history')
    ));

    evolutionWorker.terminate();
  });
};

export const downloadPhenotype = (id) => ({
  type: 'DOWNLOAD_PHENOTYPE',
  id
});

export const downloadPhenotypeDone = () => ({
  type: 'DOWNLOAD_PHENOTYPE_DONE'
});

export const setAspectRatio = (aspectRatio) => ({
  type: 'SET_ASPECT_RATIO',
  aspectRatio
});

export const toggleHistoryVisible = () => ({
  type: 'TOGGLE_HISTORY_VISIBLE'
});
