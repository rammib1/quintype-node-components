import jsx from 'rollup-plugin-jsx'

export default {
  input: 'index.js',
  output: [
    {format: "cjs", file: "dist/index.cjs.js"},
    {format: "es", file: "dist/index.es.js"}
  ],
  plugins: [
    jsx({factory: "React.createElement"})
  ],
  external: ["react","redux","react-redux","react-soundcloud-widget","superagent-bluebird-promise","lodash","url","prop-types","quintype-js","classnames","get-youtube-id","react-youtube"]
};
