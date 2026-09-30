import {Color, RawShaderMaterial} from 'three';

export type DottedLineMaterialParams = {
  color: number;
  opacity: number;
  pointSize: number;
};

export default class DottedLineMaterial extends RawShaderMaterial {
  constructor(params: DottedLineMaterialParams) {
    const {color, opacity, pointSize} = params;

    const colorObj = new Color(color);
    colorObj.convertLinearToSRGB();

    super({
      uniforms: {
        color: {value: colorObj},
        opacity: {value: opacity},
        pointSize: {value: pointSize}
      },

      // language=GLSL
      vertexShader: `
        precision highp float;
    
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float pointSize;
    
        attribute vec3 position;
        attribute vec2 uv;
        attribute vec3 instanceOffset;
    
        varying vec2 vUv;
    
        void main() {
          vUv = 2.0 * uv - vec2(1.0, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4( pointSize * position + instanceOffset, 1.0 );
        }
      `,

      // language=GLSL
      fragmentShader: `
        precision highp float;
    
        uniform vec3 color;
        uniform float opacity;
        varying vec2 vUv;
    
        void main() {
          if (length(vUv) > 1.0) discard;
          gl_FragColor = vec4(color, opacity);
        }
      `
    });
  }
}
