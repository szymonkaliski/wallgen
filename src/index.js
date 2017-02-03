import React from 'react';
import ReactDOM from 'react-dom';

import Population from './components/population';

import './index.css';

const App = () => {
  return <div>
    <div>WallGen</div>
    <Population/>
  </div>;
};

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
