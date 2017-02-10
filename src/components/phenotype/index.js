import React from 'react';

import { Node, Shaders } from 'gl-react';
import { Surface } from 'gl-react-dom';

import './phenotype.css';

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
            // return `color = mix(
            //   color,
            //   hsv2rgb(vec3(${h}, ${s}, ${v})),
            //   distance(pos, vec2(${x}, ${y})) * (1.0 + ${distMod})
            // );`;
          })
          .join('\n')
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `;
};

const Phenotype = ({ code, width = 2560 / 8, height = 1440 / 8 }) => {
  const frag = generateFrag(code);
  const shaders = Shaders.create({ wall: { frag } });

  return <div className='phenotype__wrapper'>
      <Surface width={ width } height={ height }>
      <Node
        shader={ shaders.wall }
        uniforms={{ width, height }}
      />
    </Surface>
  </div>;
};

export default Phenotype;
