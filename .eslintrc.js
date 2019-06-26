module.exports = {
  parser: "babel-eslint",
  extends: [
    "airbnb-base",
    "plugin:flowtype/recommended",
    "plugin:prettier/recommended",
    "prettier/babel",
    "prettier/flowtype",
  ],
  env: {
    es6: true,
    node: true
  },
  plugins: [
    "babel",
    "flowtype",
    "flowtype-errors",
    "prefer-arrow",
    "prettier"
  ],
  rules: {
    "arrow-body-style": "error",
    "consistent-return": "warn",
    "no-shadow": "warn",
    "prefer-template": "warn",
    "no-use-before-define": "warn",
    "babel/no-unused-expressions": ["error", {allowShortCircuit: true}],
    "flowtype-errors/enforce-min-coverage": ["warn", 80],
    "flowtype-errors/show-errors": "off",
    "import/prefer-default-export": "warn",
    "prefer-arrow/prefer-arrow-functions": "error"
  }
};
