export default {
  input: 'dist/esm/index.js',
  output: {
    name: 'window',
    file: 'dist/umd/zoomify.js',
    sourcemap: true,
    format: 'umd',
    extend: true,
  },
};
