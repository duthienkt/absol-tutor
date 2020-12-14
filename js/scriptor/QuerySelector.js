import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import {$} from "../dom/Core";

/***
 * @extends BaseCommand
 * @constructor
 */
function QuerySelector() {
    BaseCommand.apply(this, arguments);

}

OOP.mixClass(QuerySelector, BaseCommand);

QuerySelector.prototype.exec = function () {
    var elt = $(this.args.query, this.tutor.$view);
    if (!elt) throw new Error('Can not query element \"'+ this.args.query+'"');
    return Promise.resolve(elt);
};

QuerySelector.attachEnv = function (tutor, env) {
    env.QUERY_SELECTOR = function (query) {
        return new QuerySelector(tutor, { query: query });
    };
    env.$ = env.QUERY_SELECTOR;
};


export default QuerySelector;