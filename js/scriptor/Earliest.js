import BaseCommand from './BaseCommand';
import OOP from 'absol/src/HTML5/OOP';
import FunctionNameManager from "./TutorNameManager";
import TutorEngine from "./TutorEngine";

/***
 * @extends {BaseCommand}
 */
function Earliest() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Earliest, BaseCommand);


Earliest.prototype.name = 'EARLIEST';
Earliest.prototype.type = 'sync';
Earliest.prototype.argNames = [];

Earliest.prototype.exec = function () {
    var expressions = this.args.arguments.map(function (e){
        if (e.depthClone){
            return  e.depthClone().exec();
        }
        else  if (e.then){
            return  e;
        }
        else if (e.exec){
            return  e.exec();
        }
        return Promise.resolve();
    });
    return Promise.any(expressions);
};

TutorEngine.installClass(Earliest);

FunctionNameManager
    .addSync('EARLIEST');

export default Earliest;
