import React from 'react';
import { connect } from 'react-redux';

import Phenotype from '../phenotype';

const History = ({ history }) => {
  return <div>
    <div className='mw9 center ph3-ns bb b--light-gray'>
      <div className='cf ph2-ns'>
      {
        history.map(genotype => {
          return <div className='fl w-100 w-25-ns pa2' key={genotype.get('id')}>
            <Phenotype code={genotype.get('code').toJS()} aspect={16/9}/>
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