import TCommand, { inheritCommand } from "../engine/TCommand";
import findNode from "../util/findNode";
import TutorEngine from "./TutorEngine";

/***
 * @extends TCommand
 * @constructor
 */
function QuerySelector() {
    TCommand.apply(this, arguments);
}

inheritCommand(QuerySelector, TCommand);

QuerySelector.prototype.className = 'QuerySelector';
QuerySelector.prototype.name = '$';
QuerySelector.prototype.type = 'sync';
QuerySelector.prototype.argNames = ['query', 'inNode'];

QuerySelector.prototype.exec = function (){
  return findNode(this.args.query, this.args.inNode)  ;
};




TutorEngine.installClass(QuerySelector);


export default QuerySelector;