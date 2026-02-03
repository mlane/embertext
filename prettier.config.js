/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  arrowParens: 'avoid',
  bracketSameLine: false,
  jsxSingleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
}
