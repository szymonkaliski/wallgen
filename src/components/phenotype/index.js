import React, { Component } from 'react';
import autobind from 'react-autobind';
import debounce from 'lodash.debounce';
import raf from 'raf';

import { Node, Shaders } from 'gl-react';
import { Surface } from 'gl-react-dom';

const { abs, floor } = Math;

const calculateHeight = (width, aspect) => floor((1 / aspect) * width);

// TODO: move constants to another file
const GENES_COUNT = 4;

const frag = `
  precision mediump float;

  uniform float width;
  uniform float height;
  uniform float code[${GENES_COUNT * 6}];

  // https://github.com/hughsk/glsl-hsv2rgb
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 pos = gl_FragCoord.xy / vec2(width, height);

    vec3 color = hsv2rgb(vec3(
      code[3],
      code[4],
      code[5]
    ));

    for (int i = 0; i < ${GENES_COUNT}; i++) {
      color = mix(
        color,
        mix(
          color,
          hsv2rgb(vec3(code[i + 3], code[i + 4], code[i + 5])),
          distance(pos, vec2(code[i], code[i + 1]))
        ),
        code[i + 2]
      );
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

const shaders = Shaders.create({ wall: { frag } });

class Phenotype extends Component {
  constructor(props) {
    super(props);

    autobind(this);

    this.state = {
      width: 0,
      code:  props.code
    };

    this.onResize = debounce(this.onResize, 20);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUmount() {
    window.removeEventListener('resize', this.onResize);
  }

  // TODO: what if new code appears before last one stops?
  componentWillReceiveProps(nextProps) {
    const nextCode = nextProps.code;

    if (!nextCode.equals(this.state.code)) {
      const eps = 0.01;
      const k   = 0.98;

      const morphArrays = () => {
        const code = this.state.code.map((v, i) => {
          const dist = abs(v - nextCode.get(i));

          return dist < eps ? nextCode.get(i) : k * v + (1 - k) * nextCode.get(i);
        });

        this.setState({ code });

        if (!code.equals(nextCode)) {
          raf(morphArrays);
        }
      }

      raf(morphArrays);
    }
  }

  onResize() {
    const rect = this.wrapperRef ? this.wrapperRef.getBoundingClientRect() : undefined;

    if (!rect) { return; }

    const width = this.props.width || rect.width;

    this.setState({
      width: floor(width)
    });
  }

  onWrapperRef(ref) {
    this.wrapperRef = ref;
    this.onResize();
  }

  onSurfaceRef(ref) {
    this.surfaceRef = ref;
  }

  onSurfaceLoad() {
    if (this.props.onSurfaceLoad) {
      this.props.onSurfaceLoad(this.surfaceRef);
    }
  }

  renderSurface() {
    const { aspect }      = this.props;
    const { code, width } = this.state;

    // TODO: offset/center, height should be max(height, width)
    const height = calculateHeight(width, aspect);

    return <Surface
      width={ width }
      height={ height }
      webglContextAttributes={{ preserveDrawingBuffer: true }}
      ref={ this.onSurfaceRef }
      onLoad={ this.onSurfaceLoad }>
      <Node
        shader={ shaders.wall }
        uniforms={{
          width,
          height,
          code: code.toJS()
        }}
      />
    </Surface>;
  }

  render() {
    const { aspect }      = this.props;
    const { width, code } = this.state;

    return <div ref={ this.onWrapperRef }>
      { code && width !== 0 && this.renderSurface() }
    </div>;
  }
}

export default Phenotype;
