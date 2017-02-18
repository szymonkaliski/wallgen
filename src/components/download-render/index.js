import React, { Component } from 'react';
import autobind from 'react-autobind';
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

  renderModal() {
    const { download, aspectRatio } = this.props;

    // TODO: set nice width for preview image
    const width = 512;

    return <Modal open onRequestClose={this.props.downloadPhenotypeDone}>
      <div className='mb2'>
        <Phenotype
          width={ width }
          aspect={ aspectRatio }
          code={ download.get('code') }
        />
      </div>

      <div className='tc'>
        <select className='mb2' onChange={this.onSelectWidth}>
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
    </Modal>;
  }

  render() {
    const { download, aspectRatio }         = this.props;
    const { shouldDownload, selectedWidth } = this.state;

    if (!download) { return null; }

    if (!shouldDownload) { return this.renderModal(); }

    return <div className='invisible'>
      <Phenotype
        width={ selectedWidth }
        aspect={ aspectRatio }
        onSurfaceLoad={ this.onSurfaceLoad }
        code={ download.get('code') }
        forceExactSize/>
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
