import React from 'react';
import ReactDOM from 'react-dom';

import Fenotype from './components/fenotype';

import './index.css';

const App = () => {
  return <div>
    <div>WallGen</div>
    <Fenotype/>
  </div>;
};

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
