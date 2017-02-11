import React, { Component } from 'react';
import autobind from 'react-autobind';
import debounce from 'lodash.debounce';

import { Node, Shaders } from 'gl-react';
import { Surface } from 'gl-react-dom';

import './index.css';

const { floor } = Math;

const partition = (array, num) => {
  return array.reduce((memo, item, idx) => {
    if (idx % num === 0) {
      memo[memo.length] = [item];
    }
    else {
      memo[memo.length - 1].push(item);
    }

    return memo;
  }, []);
};

const generateFrag = (code) => {
  const colors = partition(code, 6);

  return `
    precision mediump float;

    uniform float width;
    uniform float height;

    // https://github.com/hughsk/glsl-hsv2rgb
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
      vec2 pos = gl_FragCoord.xy / vec2(width, height);

      vec3 color = hsv2rgb(vec3(
        ${colors[0][0]},
        ${colors[0][1]},
        ${colors[0][2]}
      ));

      ${
        colors
          .map(([x, y, distMod, h, s, v]) => {
            return `color = mix(
              color,
              mix(
                color,
                hsv2rgb(vec3(${h}, ${s}, ${v})),
                distance(pos, vec2(${x}, ${y}))
              ),
              ${distMod}
            );`;
          })
          .join('\n')
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `;
};

class Phenotype extends Component {
  constructor() {
    super();

    autobind(this);

    this.state = {
      width:        0,
      height:       0,
      shaderWidth:  0,
      shaderHeight: 0
    };

    this.onResize = debounce(this.onResize, 20);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    const { width } = this.wrapperRef.getBoundingClientRect();
    const { aspect } = this.props;

    const shaderWidth = floor(width) - 16;

    this.setState({
      shaderWidth,
      shaderHeight: floor((1 / aspect) * width) - 16,

      width: floor(width),
      height: floor((1 / aspect) * width)
    });
  }

  onRef(ref) {
    this.wrapperRef = ref;
    this.onResize();
  }

  renderSurface() {
    const { code } = this.props;

    const { shaderWidth, shaderHeight } = this.state;

    const frag    = generateFrag(code);
    const shaders = Shaders.create({ wall: { frag } });

    return <Surface width={ shaderWidth } height={ shaderHeight } className='ma--surface'>
      <Node
        shader={ shaders.wall }
        uniforms={{ width: shaderWidth, height: shaderHeight }}
      />
    </Surface>;
  }

  render() {
    const { width, height } = this.state;

    return <div ref={this.onRef} className='ba b--black-10 br2 link pointer no-underline b--hover-black-50 hide-child relative'>
      { width !== 0 && height !== 0 && this.renderSurface() }
      <div className='child white bg-black-40 absolute absolute--fill'>
        <div className='center--transform w-100 tc'>Click to Evolve</div>
      </div>
    </div>;
  }
}

export default Phenotype;
