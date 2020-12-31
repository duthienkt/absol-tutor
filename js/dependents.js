import 'absol/src/dependents';
import 'absol-brace/dependents';
import 'brace/ext/language_tools';
import 'brace/snippets/javascript';
import generator from '@babel/generator';
import presetEnv from '@babel/preset-env';
window.babel.generator = generator;
window.babel.presetEnv = presetEnv;