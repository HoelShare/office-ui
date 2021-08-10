module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-idiomatic-order',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-declaration-strict-value'],
  rules: {
    'color-named': 'never',
    'scale-unlimited/declaration-strict-value': [
      '/color$/',
      'z-index',
      'font-size',
      'font-family',
      'border-radius',
      'box-shadow',
    ],
  },
}
