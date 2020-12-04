import '../../css/basecommand.css';
import {$, _} from "../dom/Core";
import Explain from "./Explain";
import wrapAsync from "../util/wrapAsync";

function BaseCommand(tutor, args) {
    this.tutor = tutor;
    this.args = args;
}

BaseCommand.prototype.$puncturedModal = _({
    tag: 'puncturedmodal',
});

BaseCommand.prototype.$highlightModal = _({
    tag: 'puncturedmodal',
    class: ['atr-explain-modal', 'as-non-interact', 'as-animation']
});

BaseCommand.prototype.$puncturedModal = _({
    tag: 'puncturedmodal',
    class: 'as-transparent',
    style: {
        background: 'red'
    }
});

BaseCommand.prototype.$transparentModal = _('.atr-transparent-modal');

BaseCommand.prototype.preventInteract = function (flag) {
    if (!this.$transparentModal.parentElement) {
        document.body.appendChild(this.$transparentModal);
    }
    if (flag) {
        this.$transparentModal.addClass('as-hidden');
    }
    else {
        this.$puncturedModal.removeClass('as-hidden');
    }
};

BaseCommand.prototype.highlightElt = function (elt) {
    if (!this.$highlightModal.parentElement) {
        document.body.appendChild(this.$highlightModal);
    }
    this.$highlightModal.follow(elt);
    if (elt) {
        this.$highlightModal.removeClass('as-transparent');
    }
    else {
        this.$highlightModal.addClass('as-transparent');
        this.$highlightModal.reset();
    }
};

BaseCommand.prototype.onlyInteractWith = function (elt) {
    if (!this.$puncturedModal.parentElement) {
        document.body.appendChild(this.$puncturedModal);
    }
    this.$puncturedModal.follow(elt);
    if (elt) {
        this.$puncturedModal.removeClass('as-hidden');
    }
    else {
        this.$puncturedModal.addClass('as-hidden');

    }
};


/***
 * @returns {Promise}
 *
 **/
BaseCommand.prototype.exec = function () {
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

BaseCommand.prototype.asyncGetElt = function (val) {
    console.log(val)
    var res;
    if (typeof val === "string") {
        res = wrapAsync(this.tutor.findNode(val));
    }
    else {
        res = wrapAsync(val);
    }
    return res.then(function (result) {
        if (result) return $(result);
        return result;
    });
};


BaseCommand.attachEnv = function (tutor, env) {
};

export default BaseCommand;
