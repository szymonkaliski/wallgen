import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import appStore from './reducers';

import DownloadRender from './components/download-render';
import History from './components/history';
import Navbar from './components/navbar';
import Population from './components/population';

import 'tachyons/css/tachyons.css';
import './index.css';

const store = createStore(appStore);

const App = () => {
  return <div className='w-100'>
    <Navbar/>
    <Population/>
    <DownloadRender/>
  </div>;
};

ReactDOM.render(
  <Provider store={ store }>
    <App/>
  </Provider>,
  document.getElementById('root')
);
