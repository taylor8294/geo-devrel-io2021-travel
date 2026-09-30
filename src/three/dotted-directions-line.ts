import {
  BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  Path,
  Vector2
} from 'three';
import DottedLineMaterial from './material/dotted-line-material';

type DottedDirectionsLineParams = {
  pointSpacing: number;
  color: number;
  opacity: number;
  pointSize: number;
};

const MAX_POINTS = 500;

// prettier-ignore
const SQUARE_POSITION_BUFFER = new Float32Array([
  -0.5, 0.0, -0.5,  -0.5, 0.0, 0.5,  0.5, 0.0, -0.5,
  -0.5, 0.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0, -0.5
]);

// prettier-ignore
const SQUARE_UV_BUFFER = new Float32Array([0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1]);

/**
 * The dotted directions line uses instanced rendering to render a series of dots along
 * a specified path.
 */
export default class DottedDirectionsLine extends Mesh {
  geometry: InstancedBufferGeometry;
  material: DottedLineMaterial;

  params: DottedDirectionsLineParams;

  constructor(points: Vector2[], params: Partial<DottedDirectionsLineParams> = {}) {
    super();

    const {color = 0x4285f4, pointSize = 6, pointSpacing = 10, opacity = 1.0} = params;
    this.params = {color, pointSize, pointSpacing, opacity};

    this.frustumCulled = false;

    this.geometry = new InstancedBufferGeometry();
    this.geometry.attributes = {
      position: new BufferAttribute(SQUARE_POSITION_BUFFER, 3),
      uv: new BufferAttribute(SQUARE_UV_BUFFER, 2),
      instanceOffset: new InstancedBufferAttribute(new Float32Array(MAX_POINTS * 3), 3)
    };

    this.material = new DottedLineMaterial(this.params);

    this.setPoints(points);
  }

  setPoints(points: Vector2[]) {
    const attr = this.geometry.getAttribute('instanceOffset');

    const path = new Path(points);
    const spacedPoints = path.getSpacedPoints(path.getLength() / this.params.pointSpacing);

    if (spacedPoints.length > attr.array.length / 3) {
      console.warn(
        `DottedDirectionsLine: too many points, max allowed` +
          ` is ${MAX_POINTS}, got ${spacedPoints.length}`
      );
    }

    for (let i = 0; i < spacedPoints.length; i++) {
      const {x, y} = spacedPoints[i];
      attr.setXYZ(i, x, 0, y);
    }

    this.geometry.instanceCount = spacedPoints.length;
  }
}
