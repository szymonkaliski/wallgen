export const evolveGenotype = (id) => ({
  type: 'EVOLVE_GENOTYPE',
  id
});

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
