module.exports = {
  env: {
    es6: true,
    node: true,
  },
  plugins: ['prettier'],
  extends: [
    'airbnb-base',
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier" : "error",
    "class-methods-use-this": "off",
    "camelcase" : "off",
    "no-param-reassign" : "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
  }, 
};
