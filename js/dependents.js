import 'absol/src/dependents';
import generator from '@babel/generator';
import presetEnv from '@babel/preset-env';
window.babel.generator = generator;
window.babel.presetEnv = presetEnv;

console.log(generator)
