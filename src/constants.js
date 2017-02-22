export const DISPLAY_PER_PAGE = 9;
export const GENES_COUNT      = 10;
export const HISTORY_SIZE     = 3;
export const MUTATION_CHANCE  = 0.001;
export const POPULATION_SIZE  = DISPLAY_PER_PAGE * 100;

export const ASPECT_RATIOS = [
  [ "4/3",   "desktop", 4/3   ],
  [ "16/9",  "desktop", 16/9  ],
  [ "16/10", "desktop", 16/10 ],
  [ "9/16",  "phone",   9/16  ],
  [ "3/4",   "tablet",  3/4   ]
];

export const SCREEN_SIZES = {
  [16/9]:  [ 1600, 1920, 2560 ],
  [16/10]: [ 1440, 1680, 1920, 2560 ],
  [4/3]:   [ 1024, 1400, 1600 ],
  [9/16]:  [ 640, 750 ],
  [3/4]:   [ 768, 1536 ]
};

