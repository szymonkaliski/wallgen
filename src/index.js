import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import appStore from './reducers';

import Population from './components/population';

import 'tachyons/css/tachyons.css';

const store = createStore(appStore);

const App = () => {
  return <div className='fl w-100 pa2'>
    <Population/>
  </div>;
};

ReactDOM.render(
  <Provider store={ store }>
    <App/>
  </Provider>,
  document.getElementById('root')
);
