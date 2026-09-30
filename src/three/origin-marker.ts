import {Color, Group, Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader, SRGBColorSpace} from 'three';

import ORIGIN_ICON_SVG from '~/dist/static/icons/origin-icon.src.svg';
import ORIGIN_ICON_TOP_SVG from '~/dist/static/icons/origin-icon-top.src.svg';

type OriginMarkerProps = {
  color?: number | string | Color;
  size?: number;
  heading?: number;
  tilt?: number;
  zoom?: number;
  baseZoom?: number;
};

enum IconType {
  default,
  top
}

const textureLoader = new TextureLoader();

/**
 * A special marker used for the person-icon in the travel-demos. Renders a
 * person-symbol when looked at from a shallow angle and a circle when
 * looked at from above.
 */
export default class OriginMarker extends Group {
  private readonly originMarker: Mesh;
  private readonly originMarkerTop: Mesh;
  private lastProps: OriginMarkerProps = {};

  constructor(props: OriginMarkerProps) {
    super();

    this.originMarker = new Mesh(
      new PlaneGeometry(),
      new MeshBasicMaterial({
        alphaTest: 0.5,
        transparent: true
      })
    );
    this.originMarker.geometry.translate(0, 0.5, 0);

    this.originMarkerTop = new Mesh(
      new PlaneGeometry(),
      new MeshBasicMaterial({
        alphaTest: 0.5,
        transparent: true
      })
    );
    this.originMarkerTop.geometry.rotateX(-Math.PI / 2);

    this.add(this.originMarker, this.originMarkerTop);
    this.update(props);
  }

  update(props: OriginMarkerProps) {
    let {color, heading, tilt, size, zoom, baseZoom} = props;

    if (color !== undefined && color !== this.lastProps.color) {
      (this.originMarker.material as MeshBasicMaterial).map = textureLoader.load(
        getSvgIconDataUrl(IconType.default, color), (tex) => {
          // Ensure the texture uses sRGB color space to match expected colors
          tex.colorSpace = SRGBColorSpace;
        }
      );
      (this.originMarkerTop.material as MeshBasicMaterial).map = textureLoader.load(
        getSvgIconDataUrl(IconType.top, color), (tex) => {
          // Ensure the texture uses sRGB color space to match expected colors
          tex.colorSpace = SRGBColorSpace;
        }
      );
    }

    baseZoom = baseZoom !== undefined ? baseZoom : this.lastProps.baseZoom;
    if (zoom !== undefined && baseZoom !== undefined) {
      this.scale.setScalar(Math.pow(1.6, baseZoom - zoom));
    }

    if (baseZoom !== undefined) {
      this.lastProps.baseZoom = baseZoom;
    }

    if (tilt !== undefined && tilt !== this.lastProps.tilt) {
      this.originMarker.visible = tilt > 30;
      this.originMarkerTop.visible = tilt <= 30;
      this.lastProps.tilt = tilt;
    }

    if (size !== undefined && size !== this.lastProps.size) {
      this.originMarker.scale.setScalar(size);
      this.originMarkerTop.scale.setScalar(size / 2);
      this.lastProps.size = size;
    }

    if (heading !== undefined && heading !== this.lastProps.heading) {
      this.originMarker.rotation.y = (-heading / 180) * Math.PI;
      this.lastProps.heading = heading;
    }
  }
}

const tmpColor = new Color();

function getSvgIconDataUrl(type: IconType, color: number | string | Color) {
  const svg = type === IconType.default ? ORIGIN_ICON_SVG : ORIGIN_ICON_TOP_SVG;

  tmpColor.set(color);

  return `data:image/svg+xml;base64,${btoa(
    svg.replaceAll(/fill="#000(?:000)?"/g, `fill="#${tmpColor.getHexString()}"`)
  )}`;
}
