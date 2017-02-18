import React from 'react';
import { connect } from 'react-redux';

import Phenotype from '../phenotype';

const History = ({ history }) => {
  return <div>
    <div className='mw9 center ph3-ns bb b--light-gray'>
      <div className='cf ph2-ns'>
        {
          history.map((genotype, i) => {
            return <div className='fl w-100 w-third-ns pa2' key={ i }>
              <Phenotype code={ genotype.get('code') } aspect={ 16/9 }/>
            </div>;
          })
        }
      </div>
    </div>
  </div>;
};

const mapStateToProps = (state) => ({
  history: state.get('history')
});

export default connect(mapStateToProps)(History);
