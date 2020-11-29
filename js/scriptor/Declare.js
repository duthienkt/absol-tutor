import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';

/***
 * @extends {BaseCommand}
 */
function Declare() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Declare, BaseCommand);

Declare.prototype.exec = function () {
    //todo
};


Declare.attachEnv = function (tutor, env) {
    env.DECLARE = function (name, initValue) {
        tutor.push(new Declare(tutor, { name: name, initValue: initValue }));
    };
};

export default Declare;
