import React, { Component } from 'react';
import autobind from 'react-autobind';
import last from 'lodash.last';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { downloadPhenotypeDone } from '../../actions';

import Modal from '../modal';
import Phenotype from '../phenotype';

import { SCREEN_SIZES } from '../../constants';

const downloadUrl = (url, name) => {
  const link    = document.createElement('a');
  link.download = name;
  link.href     = url;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const { round } = Math;

class DownloadRender extends Component {
  constructor() {
    super();

    autobind(this);

    this.state = {
      shouldDownload: false,
      selectedWidth:  undefined
    };
  }

  onSurfaceLoad(ref) {
    const { download } = this.props;
    const dataUrl      = ref.captureAsDataURL('png', 1.0);

    downloadUrl(dataUrl, `wallgen-${download.get('id')}.png`);

    this.setState({
      shouldDownload: false,
      selectedWidth:  undefined
    }, this.props.downloadPhenotypeDone);
  }

  onSelectWidth(event) {
    this.setState({ selectedWidth: event.target.value });
  }

  onClickDownload() {
    this.setState({ shouldDownload: true });
  }

  renderModalContent() {
    const { download, aspectRatio } = this.props;

    // TODO: set nice width for preview image
    const width = 512;

    return <div>
      <div className='mb2'>
        <Phenotype
          width={ width }
          aspect={ aspectRatio }
          code={ download.get('code') }
        />
      </div>

      <div className='tc'>
        <select className='mb2' onChange={ this.onSelectWidth } value={ last(SCREEN_SIZES[aspectRatio]) }>
          {
            SCREEN_SIZES[aspectRatio].map(width => (
              <option key={ width } value={ width }>
                { width } x { round(width * (1 / aspectRatio)) }
              </option>
            ))
          }
        </select>

        <div className='tc'>
          <div
            onClick={ this.onClickDownload }
            className='dib w-120px pa2 tc pointer bg-animate hover-white hover-bg-black ba border-box'>
            Download
          </div>
        </div>
      </div>
    </div>;
  }

  renderModal() {
    const { download } = this.props;

    return <Modal open={ !!download } onRequestClose={ this.props.downloadPhenotypeDone }>
      { download && this.renderModalContent() }
    </Modal>;
  }

  renderPhenotype() {
    const { download, aspectRatio } = this.props;
    const { selectedWidth }         = this.state;

    return <Phenotype
      width={ selectedWidth }
      aspect={ aspectRatio }
      onSurfaceLoad={ this.onSurfaceLoad }
      code={ download.get('code') }
      forceExactSize/>;
  }

  render() {
    const { download }       = this.props;
    const { shouldDownload } = this.state;

    return <div>
      { this.renderModal() }

      <div className='invisible'>
        { shouldDownload && download && this.renderPhenotype() }
      </div>
    </div>;
  }
}

const mapStateToProps = (state) => ({
  download:    state.get('download'),
  aspectRatio: state.get('aspectRatio')
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  downloadPhenotypeDone
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DownloadRender);
