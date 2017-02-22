import React from 'react';
import { connect } from 'react-redux';

import Modal from '../modal';

const Preloader = ({ evolving }) => <Modal open={ evolving }>Evolving...</Modal>;

const mapStateToProps = (state) => ({ evolving: state.get('evolving') });

export default connect(mapStateToProps)(Preloader);
