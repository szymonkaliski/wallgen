import React from 'react';
import ReactDOM from 'react-dom';

import Population from './components/population';

import 'tachyons/css/tachyons.css';

const App = () => {
  return <div className='fl w-100 pa2'>
    <Population/>
  </div>;
};

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);
