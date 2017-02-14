import React, { Component } from 'react';
import autobind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { downloadPhenotypeDone } from '../../actions';

import Modal from '../modal';
import Phenotype from '../phenotype';

const downloadUrl = (url, name) => {
  const link    = document.createElement('a');
  link.download = name;
  link.href     = url;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const WIDTHS = {
  [16/9]:  [ 1366, 1600, 1920, 2560 ],
  [16/10]: [ 1440, 1680, 3840, 1920, 2560 ],
  [4/3]:   [ 1024, 1400, 1600 ],
  [9/16]:  [ 640, 750 ],
  [3/4]:   [ 768, 1536 ]
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
    this.props.downloadPhenotypeDone();
  }

  onSelectWidth(width) {
    this.setState({ selectedWidth: width });
  }

  onClickDownload() {
    this.setState({ shouldDownload: true });
  }

  renderModal() {
    const { download } = this.props;

    // TODO: how to set width here?
    const width  = 512;
    const aspect = 16/9;

    return <Modal open onRequestClose={this.props.downloadPhenotypeDone}>
      <div className='mb2'>
        <Phenotype
          width={width}
          aspect={aspect}
          code={download.get('code').toJS()}
        />
      </div>

      <div className='tc'>
        <select className='mb2'>
          {
            WIDTHS[aspect].map(width => (
              <option key={width} onChange={() => this.onSelectWidth(width)}>
                { width } x { round(width * (1 / aspect)) }
              </option>
            ))
          }
        </select>

        <div className='tc'>
          <div
            onClick={this.onClickDownload}
            className='dib w-120px pa2 tc pointer bg-animate hover-white hover-bg-black ba border-box'>
            Download
          </div>
        </div>
      </div>
    </Modal>;
  }

  render() {
    const { download }       = this.props;
    const { shouldDownload } = this.state;

    if (!download) { return null; }

    if (!shouldDownload) { return this.renderModal(); }

    // TODO
    const width  = 2560;
    const aspect = 16/9;

    return <div className='invisible'>
      <Phenotype
        width={width}
        aspect={aspect}
        onSurfaceLoad={this.onSurfaceLoad}
        code={download.get('code').toJS()}/>
    </div>;
  }
}

const mapStateToProps = (state) => ({
  download: state.get('download')
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  downloadPhenotypeDone,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DownloadRender);
