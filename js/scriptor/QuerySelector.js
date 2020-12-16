import {$} from "../dom/Core";
import FunctionNameManager from "./TutorNameManager";

var  QuerySelector =  {};

QuerySelector.attachEnv = function (tutor, env) {
    env.querySelector = function (query, root){
        var elt = $(query, root || tutor.$view);
        if (!elt) throw new Error('Can not query element \"'+ query+'"');
    };
    env.$ = env.querySelector;
};


FunctionNameManager.addSync('$')
    .addSync('querySelector');

export default QuerySelector;