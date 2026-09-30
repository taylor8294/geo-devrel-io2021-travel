import {ExtrudeGeometry, Group, Mesh, MeshStandardMaterial, Shape, Vector2, Vector3} from 'three';
import {LineSegmentsGeometry} from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {LineSegments2} from 'three/examples/jsm/lines/LineSegments2.js';

const BUILDING_HEIGHT = 32.1;
const LINE_MATERIAL_COLOR = 0x0f9d58;

const REFERENCE_COORDS = {lat: 51.50706959, lng: -0.1416204};
const BUILDING_POINTS = [
  [-36.56293903, 0, 9.22497829],
  [19.67281377, 0, -35.14630651],
  [26.44845583, 0, -25.23437706],
  [30.45224432, 0, -23.17170832],
  [33.56945493, 0, -17.79209034],
  [33.3805121, 0, -14.01479347],
  [41.91200747, 0, 2.7267378],
  [33.3002287, 0, 7.96069023],
  [32.68772173, 0, 7.26127318],
  [19.72402904, 0, 15.02602563],
  [16.09120522, 0, 10.01891117],
  [17.15703656, 0, 9.07375298],
  [16.58190289, 0, 7.52258161],
  [19.07068827, 0, 5.53330163],
  [17.17779951, 0, 2.62888613],
  [18.32737473, 0, 1.69039966],
  [14.80182614, 0, -3.20329581],
  [8.25111602, 0, 1.02767698],
  [14.31735736, 0, 9.89770853],
  [-22.70505538, 0, 31.94546904]
];

/**
 * The Mesh used to replace the original building. By making this mesh slightly
 * larger than the original building, rendering it will block the original
 * from being rendered.
 */
export default class HotelMesh extends Group {
  static referenceCoords = REFERENCE_COORDS;

  private lineMaterial: LineMaterial = new LineMaterial({
    color: LINE_MATERIAL_COLOR,
    linewidth: 1,
    vertexColors: false,
    dashed: false
  });

  private buildingMaterial: MeshStandardMaterial = new MeshStandardMaterial({
    transparent: true,
    opacity: 0.5,
    color: 0x00ff00
  });

  constructor() {
    super();

    const points = BUILDING_POINTS.map(xyz => new Vector3(...xyz));

    this.add(this.createBuildingWireframe(points), this.createBuildingMesh(points));
  }

  setViewportSize(viewportSize: Vector2) {
    this.lineMaterial.resolution.copy(viewportSize);
  }

  private createBuildingMesh(points: Vector3[]) {
    const geometry = new ExtrudeGeometry(new Shape(points.map(p => new Vector2(p.x, -p.z))), {
      depth: BUILDING_HEIGHT,
      bevelEnabled: false
    });

    geometry.rotateX(-Math.PI / 2);

    return new Mesh(geometry, this.buildingMaterial);
  }

  private createBuildingWireframe(points: Vector3[]): LineSegments2 {
    // for every point along the footprint there are three edges (bottom to
    // next point, bottom to top, top to next point):
    //
    //     3 edges * 2 points/edge * 3 values/point --> 18 values
    //
    // The positions-array will contain all bottom-edges, then all top-edges
    // and finally all edges connecting bottom to top
    const numPoints = points.length;
    const positions = new Float32Array(18 * numPoints);
    const pointsTop = points.map(p => p.clone().setY(BUILDING_HEIGHT));

    // bottom and top edge-loops
    const topStartOffset = numPoints * 6;
    const verticalStartOffset = numPoints * 12;

    for (let i = 0; i < numPoints; i++) {
      const b0 = points[i];
      const t0 = pointsTop[i];

      const b1 = points[(i + 1) % numPoints];
      const t1 = pointsTop[(i + 1) % numPoints];

      const vertexOffset = 6 * i;

      // bottom edge
      b0.toArray(positions, vertexOffset);
      b1.toArray(positions, vertexOffset + 3);

      // top edge
      t0.toArray(positions, topStartOffset + vertexOffset);
      t1.toArray(positions, topStartOffset + vertexOffset + 3);

      // connecting edge
      b0.toArray(positions, verticalStartOffset + vertexOffset);
      t0.toArray(positions, verticalStartOffset + vertexOffset + 3);
    }

    const lineGeometry = new LineSegmentsGeometry();
    lineGeometry.instanceCount = 3 * points.length;
    lineGeometry.setPositions(positions);

    const line = new LineSegments2(lineGeometry, this.lineMaterial);
    line.computeLineDistances();

    return line;
  }
}
