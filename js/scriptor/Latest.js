import BaseCommand from './BaseCommand';
import TutorEngine from "./TutorEngine";
import { inheritCommand } from "../engine/TCommand";

/***
 * @extends {BaseCommand}
 */
function Latest() {
    BaseCommand.apply(this, arguments);
}

inheritCommand(Latest, BaseCommand);


Latest.prototype.name = 'LATEST';
Latest.prototype.type = 'sync';
Latest.prototype.argNames = [];

Latest.prototype.exec = function () {
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
    return Promise.all(expressions);
};

TutorEngine.installClass(Latest);

export default Latest;
