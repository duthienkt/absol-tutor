import FunctionNameManager from "./TutorNameManager";

var QuerySelector = {};

QuerySelector.attachEnv = function (tutor, env) {
    env.querySelector = function (query) {
        var elt = tutor.findNode(query, true);
        if (!elt) throw new Error('Can not query element \"' + query + '"');
        return elt;
    };
    env.$ = env.querySelector;
    env.querySelectorAll = function (query) {
        return tutor.findAllNode(query);
    };
    env.$$ = env.querySelectorAll;
};


FunctionNameManager.addSync('$')
    .addSync('querySelector')
    .addSync('$$')
    .addSync('querySelectoAllr');

export default QuerySelector;