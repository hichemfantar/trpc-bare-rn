/** @type {import("@babel/core").ConfigFunction} */
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [['module-resolver', {alias: {'~': './src'}}]],
};
