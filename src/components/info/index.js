import React from 'react';

const Info = () =>
  <div>
    <p>
      WallGen is an evolutionary wallpaper generator made by{' '}
      <a className="link bb b--gray no-underline white hover-gray" href="http://szymonkaliski.com" target="_blank">
        Szymon Kaliski
      </a>.
    </p>

    <p>
      Abstract wallpapers are initially generated at random, each <i>evolve</i> takes another evolution step, with
      selected wallpaper becoming the most <i>fit</i> one.
    </p>

    <p>
      Wallpapers evolve by mutation and crossover, with crossover chance being proportional to how similar given image
      is to the most fit one.
    </p>

    <p>
      Whole process takes place in your browser, nothing is persisted on the server, so once you close the tab, you will
      never see these wallpapers again.
    </p>
  </div>;

export default Info;
