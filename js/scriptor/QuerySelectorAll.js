import TCommand, { inheritCommand } from "../engine/TCommand";
import findNode from "../util/findNode";
import TutorEngine from "./TutorEngine";
import findAllNodes from "../util/findAllNodes";

/***
 * @extends TCommand
 * @constructor
 */
function QuerySelectorAll() {
    TCommand.apply(this, arguments);
}

inheritCommand(QuerySelectorAll, TCommand);

QuerySelectorAll.prototype.className = 'QuerySelectorAll';
QuerySelectorAll.prototype.name = '$$';
QuerySelectorAll.prototype.type = 'sync';
QuerySelectorAll.prototype.argNames = ['query', 'inNode'];

QuerySelectorAll.prototype.exec = function (){
  return findAllNodes(this.args.query, this.args.inNode)  ;
};




TutorEngine.installClass(QuerySelectorAll);


export default QuerySelectorAll;