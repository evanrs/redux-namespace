const env = process.env.BABEL_ENV || process.env.NODE_ENV;
const modules = process.env.BABEL_MODULES || env === 'test' ? 'commonjs' : false;

const plugins = [
  require.resolve('babel-plugin-lodash'),
  require.resolve('babel-plugin-transform-class-properties'),
  require.resolve('babel-plugin-transform-export-extensions'),
  [require.resolve('babel-plugin-transform-object-rest-spread'), { useBuiltIns: true }]
];

module.exports = {
  presets: [
    [
      require.resolve('babel-preset-env'),
      { targets: { ie: 9, uglify: true }, useBuiltIns: false, modules: modules }
    ]
  ],
  plugins: plugins
};
