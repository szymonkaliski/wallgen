import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { toggleInfoVisible } from '../../actions';

import Modal from '../modal';

const Info = ({ infoVisible, toggleInfoVisible }) => <Modal
  onRequestClose={ toggleInfoVisible }
  open={ infoVisible }>
  <div>
    <p>
      WallGen is an evolutionary wallpaper generator made by <a className='link bb b--gray no-underline white hover-gray' href='http://szymonkaliski.com' target='_blank'>Szymon Kaliski</a>.
    </p>

    <p>
      Abstract wallpapers are initially generated at random, each <i>evolve</i> takes another evolution step, with selected wallpaper becoming most <i>fit</i> one.
    </p>

    <p>
      Wallpapers evolve by mutation and crossover, with crossover chance being proportional to how similar given image is to the most fit one.
    </p>

    <p>
      Whole process takes place in your browser, nothing in persisted on the server, so once you close the tab, you will never see these wallpapers again.
    </p>
  </div>
</Modal>;

const mapStateToProps = (state) => ({ infoVisible: state.get('infoVisible') });

const mapDispatchToProps = (dispatch) => bindActionCreators({ toggleInfoVisible }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Info);
