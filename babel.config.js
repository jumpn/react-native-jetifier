module.exports = {
  ignore: ["./src/run.js"],
  presets: [
    [
      "@babel/preset-env",
      {
        corejs: 3,
        spec: true,
        targets: {node: "current"},
        useBuiltIns: "usage"
      }
    ],
    "@babel/preset-flow"
  ],
  plugins: [
    "@babel/plugin-syntax-import-meta",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-optional-chaining"
  ]
};
