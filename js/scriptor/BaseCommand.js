import  '../../css/basecommand.css';
import {_} from "../dom/Core";
import Explain from "./Explain";

function BaseCommand(tutor, args) {
    this.tutor = tutor;
    this.args = args;
}

BaseCommand.prototype.$puncturedModal = _({
    tag: 'puncturedmodal',
    class: 'atr-explain-modal'
});

BaseCommand.prototype.$transparentModal = _('.atr-transparent-modal');


/***
 * @returns {Promise}
 *
 **/
BaseCommand.prototype.exec = function (tutor) {
    return Promise.resolve();
};


BaseCommand.prototype.depthClone = function () {
    var args = this.args;
    var newArgs = Object.keys(args).reduce(function (ac, cr) {
        if (args[cr] && args[cr].depthClone) {
            ac[cr] = args[cr].depthClone();
        }
        else {
            ac[cr] = args[cr];
        }
        return ac;
    }, {});

    return new this.constructor(this.tutor, newArgs);

};


BaseCommand.attachEnv = function (tutor, env) {
};

export default BaseCommand;