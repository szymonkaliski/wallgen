import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { setAspectRatio } from '../../actions';

const ASPECT_RATIOS = [
  [ "4/3",   "desktop", 4/3   ],
  [ "16/9",  "desktop", 16/9  ],
  [ "16/10", "desktop", 16/10 ],
  [ "9/16",  "phone",   9/16  ],
  [ "3/4",   "tablet",  3/4   ]
];

const Navbar = ({ aspectRatio, setAspectRatio }) => {
  return <div className='w-100 light-gray bg-black-80 pa2 mb4'>
    WallGen <span className='silver'>genetic wallpaper generator</span>

    <div className='dib fr'>
      {
        ASPECT_RATIOS.map(([ text, tooltip, ratio ]) => (
          <span
            key={ text }
            title={ tooltip }
            onClick={ () => setAspectRatio(ratio) }
            className={ `pointer dim mr2 ${aspectRatio === ratio ? 'light-gray' : 'silver'}` }>
            { text }
          </span>
        ))
      }

      <span className='ml2'>
        info
      </span>
    </div>
  </div>;
};

const mapStateToProps = (state) => ({
  aspectRatio: state.get('aspectRatio')
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setAspectRatio
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
