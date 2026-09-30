import {
  CanvasTexture,
  DoubleSide,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshBasicMaterialParameters,
  PlaneGeometry,
  SRGBColorSpace
} from 'three';

export interface HtmlMeshProps {
  /**
   * The html to render.
   */
  html?: string;

  /**
   * URL to a stylesheet with font-declarations (tested with google fonts stylesheets)
   */
  fontStylesheetUrl?: string;

  /**
   * The width of the Mesh in world-units (meters) (default: 10)
   */
  width?: number;

  /**
   * The pixel-size of the canvas-texture, should be a power of 2 (default: 512).
   * This is also the viewport size for the html being rendered.
   */
  textureWidth?: number;
  textureHeight?: number;

  /**
   * Additional properties for the default-material.
   */
  materialParams?: MeshBasicMaterialParameters;
}

/**
 * A simple mesh with a plane geometry to easily embed simple html-content
 * like wrapped, multicolored text into a 3D-scene. The html is rendered to a
 * canvas (via svg foreignContent) which is then used as texture.
 *
 * Please note that y-position and scale of this mesh are updated internally
 * and cannot be used for positioning. The best way to use it is to add it
 * to a group and position that instead.
 */
export default class HtmlMesh extends Mesh {
  material: MeshBasicMaterial;
  geometry: PlaneGeometry;

  private lastProps: HtmlMeshProps;
  private readonly canvas: HTMLCanvasElement;

  constructor(props: HtmlMeshProps) {
    super();

    const {materialParams} = props;
    this.canvas = document.createElement('canvas');

    this.geometry = new PlaneGeometry(1, 1);
    const canvasTexture = new CanvasTexture(this.canvas);
    canvasTexture.premultiplyAlpha = true;
    canvasTexture.anisotropy = 4;
    canvasTexture.colorSpace = SRGBColorSpace;

    // inspect canvas-content:
    // document.body.appendChild(this.canvas);
    // this.canvas.style.cssText = `position: fixed; bottom: 0; right: 0;`;

    this.material = new MeshBasicMaterial({
      transparent: true,
      color: 0xffffff,
      ...materialParams,
      alphaTest: 0.5,
      map: canvasTexture,
      side: DoubleSide
    });
    this.lastProps = {};
    this.update(props);
  }

  update(props: HtmlMeshProps) {
    const {
      html = '',
      width = 10, // world-units
      textureWidth = 512,
      textureHeight = 512,
      fontStylesheetUrl = ''
    } = props;

    const textureSizeChanged =
      textureWidth !== this.lastProps.textureWidth || textureHeight !== this.lastProps.textureHeight;

    if (textureSizeChanged || width !== this.lastProps.width) {
      const aspectRatio = textureWidth / textureHeight;
      const height = width / aspectRatio;

      this.canvas.width = textureWidth;
      this.canvas.height = textureHeight;

      this.scale.set(width, height, 1);
      this.position.y = width / 2;

      this.lastProps.width = width;
      this.lastProps.textureWidth = textureWidth;
      this.lastProps.textureHeight = textureHeight;
    }

    if (textureSizeChanged || html !== this.lastProps.html || fontStylesheetUrl !== this.lastProps.fontStylesheetUrl) {
      this.renderHtml(html, fontStylesheetUrl).then(() => {
        this.material.map!.needsUpdate = true;
      });
      this.lastProps.html = html;
    }

    if (props.materialParams) {
      (this.material as Material).setValues(props.materialParams);
      this.lastProps.materialParams = props.materialParams;
    }
  }

  /**
   * Renders the specified html-text (body-content, including style-definitions in <style>-tags)
   * to the canvas. If a font-stylesheet is specified, all fonts from that stylesheet have to be
   * downloaded and inlined into the html-document without looking at what is required. It is
   * recommended to only include the fonts that are needed for rendering.
   * @param html
   * @param googleFontsUrl
   * @private
   */
  private async renderHtml(html: string, googleFontsUrl?: string): Promise<void> {
    let fontStylesheet = '';
    if (googleFontsUrl) {
      fontStylesheet = await getFontStylesheet(googleFontsUrl);
    }

    const {width, height} = this.canvas;

    return this.renderSvg(`
      <svg xmlns='http://www.w3.org/2000/svg'  
          width='${width}'
          height='${height}'
          viewBox='0 0 ${width} ${height}'
          externalResourcesRequired='true'>
        <foreignObject width='${width}px' height='${height}px' requiredExtensions='http://www.w3.org/1999/xhtml'>
          <body xmlns='http://www.w3.org/1999/xhtml'>
            ${fontStylesheet ? `<style>${fontStylesheet}</style>` : ''}
            ${html}
          </body>
        </foreignObject>
      </svg>
    `);
  }

  /**
   * Renders the given svg as image to the canvas.
   * @param svgCode
   * @private
   */
  private async renderSvg(svgCode: string): Promise<void> {
    const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    const {width, height} = this.canvas;

    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve();
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgCode)}`;
    });
  }
}

const stylesheetMap = new Map<string, Promise<string>>();
const fontUrlMap = new Map<string, Promise<string>>();

/**
 * Retrieves the font-stylesheet for the specified URL. Stylesheets are cached by url.
 * @param fontStylesheetUrl
 */
async function getFontStylesheet(fontStylesheetUrl: string): Promise<string> {
  if (stylesheetMap.has(fontStylesheetUrl)) {
    return stylesheetMap.get(fontStylesheetUrl)!;
  }

  const promise = loadFontStylesheet(fontStylesheetUrl);
  stylesheetMap.set(fontStylesheetUrl, promise);

  return await promise;
}

/**
 * Loads the font-stylesheet and replaces all css `url()` values with
 * a base64-version of the font-file.
 * @param fontStylesheetUrl
 */
async function loadFontStylesheet(fontStylesheetUrl: string): Promise<string> {
  const res = await fetch(fontStylesheetUrl);
  let cssText = await res.text();

  const rxUrl = /url\(([^)]*)\)/g;

  let match;
  while ((match = rxUrl.exec(cssText))) {
    const [, url] = match;

    if (!fontUrlMap.has(url)) {
      fontUrlMap.set(url, loadAsDataUrl(url));
    }
  }

  for (const [url, dataUrlPromise] of fontUrlMap.entries()) {
    cssText = cssText.replaceAll(url, await dataUrlPromise);
  }

  return cssText;
}

/**
 * Fetches the specified URL and returns the contents as a data-url.
 * @param url
 */
async function loadAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();

  return await new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });
}
