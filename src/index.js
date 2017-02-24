import React from 'react';
import ReactDOM from 'react-dom';

import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import appStore from './reducers';

import DownloadRender from './components/download-render';
import History from './components/history';
import Info from './components/info';
import Navbar from './components/navbar';
import Population from './components/population';
import Preloader from './components/preloader';

import 'tachyons/css/tachyons.css';
import './index.css';

const store = createStore(appStore, applyMiddleware(thunk));

const App = () => <div className='w-100'>
  <Navbar/>
  <Population/>
  <History/>
  <DownloadRender/>
  <Preloader/>
  <Info/>
</div>;

ReactDOM.render(
  <Provider store={ store }>
    <App/>
  </Provider>,
  document.getElementById('root')
);
