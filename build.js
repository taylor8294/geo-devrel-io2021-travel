import esbuild from 'esbuild';
import path from 'path';

// Plugin to serve standard .svg files as a static URL string from the dist folder, without copying or cache busting
const staticUrlPlugin = {
  name: 'static-url-plugin',
  setup(build) {
    build.onLoad({ filter: /\.(svg|gltf)$/ }, (args) => {
      // Bypass .src.svg files so they fall back to esbuild's text loader
      if (args.path.endsWith('.src.svg')) {
        return null; 
      }

      const relativePath = path.relative(process.cwd(), args.path);
      const publicPath = './' + relativePath.replace(/\\/g, '/').replace(/^\/?dist\//g, '');

      return {
        loader: 'js',
        contents: `export default ${JSON.stringify(publicPath)};`,
      };
    });
  },
};

await esbuild.build({
  entryPoints: ['src/sites/travel/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: 'dist/bundle.js',
  publicPath: '/',
  loader: {
    '.src.svg': 'text',
    // .svg and .gltf are now handled entirely by the plugin above
  },
  plugins: [staticUrlPlugin],
  define: {
    'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY),
    'process.env.GOOGLE_MAPS_MAP_ID': JSON.stringify(process.env.GOOGLE_MAPS_MAP_ID || 'dd811470737ed2c6'),
  },
});