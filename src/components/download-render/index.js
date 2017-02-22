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

const { min, ceil } = Math;

class DownloadRender extends Component {
  constructor() {
    super();

    autobind(this);

    this.state = {
      shouldDownload: false,
      downloadWidth:  undefined
    };
  }

  componentDidMount() {
    this.onResize();

    window.addEventListener('resize', this.onResize);
  }

  componentWillUmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      downloadWidth: last(SCREEN_SIZES[nextProps.aspectRatio])
    });
  }

  onResize() {
    this.setState({
      width: 0.8 * min(window.innerWidth, window.innerHeight)
    });
  }

  onSurfaceLoad(ref) {
    const { download } = this.props;
    const dataUrl      = ref.captureAsDataURL('png', 1.0);

    downloadUrl(dataUrl, `wallgen-${download.get('id')}.png`);

    this.onClose();
  }

  onSelectDownloadWidth(event) {
    this.setState({ downloadWidth: event.target.value });
  }

  onClickDownload() {
    this.setState({ shouldDownload: true });
  }

  onClose() {
    this.setState({
      shouldDownload: false,
      downloadWidth:  undefined
    }, this.props.downloadPhenotypeDone);
  }

  renderModalContent() {
    const { width, downloadWidth }  = this.state;
    const { download, aspectRatio } = this.props;

    return <div>
      <div className='mb2' onClick={ this.onClose }>
        <Phenotype
          width={ width }
          aspect={ aspectRatio }
          code={ download.get('code') }
        />
      </div>

      <div className='tc'>
        <select className='mb2' onChange={ this.onSelectDownloadWidth } value={ downloadWidth }>
          {
            SCREEN_SIZES[aspectRatio].map(width => (
              <option key={ width } value={ width }>
                { width } x { ceil(width * (1 / aspectRatio)) }
              </option>
            ))
          }
        </select>

        <div className='tc'>
          <div
            onClick={ this.onClickDownload }
            className='dib w-120px pa2 tc pointer bg-animate hover-white hover-bg-gray ba b--gray border-box'>
            Download
          </div>
        </div>
      </div>
    </div>;
  }

  renderModal() {
    const { download } = this.props;

    return <Modal open={ !!download } onRequestClose={ this.onClose }>
      { download && this.renderModalContent() }
    </Modal>;
  }

  renderPhenotype() {
    const { download, aspectRatio } = this.props;
    const { downloadWidth }         = this.state;

    return <div>
      <Phenotype
        width={ downloadWidth }
        aspect={ aspectRatio }
        onSurfaceLoad={ this.onSurfaceLoad }
        code={ download.get('code') }
        forceExactSize/>
    </div>;
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
