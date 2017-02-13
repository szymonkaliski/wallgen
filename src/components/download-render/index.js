import React, { Component } from 'react';
import autobind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { downloadPhenotypeDone, } from '../../actions';

import Phenotype from '../phenotype';

const downloadUrl = (url, name) => {
  const link    = document.createElement('a');
  link.download = name;
  link.href     = url;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

class DownloadRender extends Component {
  constructor() {
    super();

    autobind(this);
  }

  onSurfaceLoad(ref) {
    const { download } = this.props;
    const dataUrl      = ref.captureAsDataURL('png', 1.0);

    downloadUrl(dataUrl, `wallgen-${download.get('id')}.png`);
    this.props.downloadPhenotypeDone();
  }

  render() {
    const { download } = this.props;

    if (!download) { return null; }

    return <div className='invisible'>
      <Phenotype
        width={2560}
        aspect={16/9}
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
