import React from 'react';
import ReactDOM from 'react-dom';

import thunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import { applyMiddleware, bindActionCreators, createStore } from 'redux';

import appStore from './reducers';
import { toggleHistoryVisible, toggleInfoVisible } from './actions';

import DownloadRender from './components/download-render';
import History from './components/history';
import Info from './components/info';
import Navbar from './components/navbar';
import Population from './components/population';
import Preloader from './components/preloader';
import Modal from './components/modal';

import 'tachyons/css/tachyons.css';
import './index.css';

const store = createStore(appStore, applyMiddleware(thunk));

const App = ({
  isEvolving,
  historyVisible,
  infoVisible,
  toggleHistoryVisible,
  toggleInfoVisible,
}) => {
  const showModal = isEvolving || historyVisible || infoVisible;

  const onRequestClose = {
    [historyVisible]: toggleHistoryVisible,
    [infoVisible]:    toggleInfoVisible
  }[true];

  return <div className='w-100'>
    <Navbar/>
    <Population/>
    <Modal open={ showModal } onRequestClose={ onRequestClose }>
      { historyVisible && <History/> }
      { isEvolving && <Preloader/> }
      { infoVisible && <Info/> }
    </Modal>
    <DownloadRender/>
  </div>;
};

const mapStateToProps = (state) => ({
  isEvolving:     state.get('isEvolving'),
  historyVisible: state.get('historyVisible'),
  infoVisible:    state.get('infoVisible')
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleHistoryVisible,
  toggleInfoVisible
}, dispatch);

const AppConnected = connect(mapStateToProps, mapDispatchToProps)(App);

ReactDOM.render(
  <Provider store={ store }>
    <AppConnected/>
  </Provider>,
  document.getElementById('root')
);
