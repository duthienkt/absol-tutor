import '../../css/basecommand.css';
import {$, _} from "../dom/Core";
import wrapAsync from "../util/wrapAsync";
import ToolTip from "absol-acomp/js/Tooltip";
import Toast from "absol-acomp/js/Toast";
import Context from "absol/src/AppPattern/Context";
import OOP from "absol/src/HTML5/OOP";

/***
 * @extends Context
 * @param tutor
 * @param args
 * @constructor
 */
function BaseCommand(tutor, args) {
    Context.call(this);
    this.ev_tutorPause = this.ev_tutorPause.bind(this);
    this.ev_tutorStop = this.ev_tutorStop.bind(this);
    this.tutor = tutor;
    this.args = args;
    this.tooltipToken = null;
    this._tostElts = [];
}

OOP.mixClass(BaseCommand, Context);


BaseCommand.prototype.$highlightModal = _({
    tag: 'puncturedmodal',
    class: ['atr-explain-modal', 'as-non-interact', 'as-animation']
});

BaseCommand.prototype.$puncturedModal = _({
    tag: 'puncturedmodal',
    class: 'as-transparent',
    style: {
        background: 'red'
    },
    props: {
        onInteractOut: null,
    },
    on: {
        click: function (event) {
            this.onInteractOut && this.onInteractOut(event);
        }
    }
});

BaseCommand.prototype.$transparentModal = _('.atr-transparent-modal');

BaseCommand.prototype.$tooltipContent = _({
    class: 'atr-explain-text',
    child: { text: '' }
});

BaseCommand.prototype.onStart = function () {
    this.tutor.on('stop', this.ev_tutorStop);

};

BaseCommand.prototype.onPause = function () {
    this.tutor.off('pause', this.ev_tutorPause);
};

BaseCommand.prototype.onResume = function () {
    this.tutor.on('pause', this.ev_tutorPause);
};

BaseCommand.prototype.onStop = function () {
    this.tutor.off('stop', this.ev_tutorStop);
    this.closeTooltip();
    this.closeAllToasts();
    this.highlightElt(null);
    this.onlyInteractWith(null);
};


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

BaseCommand.prototype.onlyInteractWith = function (elt, onInteractOut) {
    if (!this.$puncturedModal.parentElement) {
        document.body.appendChild(this.$puncturedModal);
    }
    if (elt) {
        this.$puncturedModal.follow(elt);
        this.$puncturedModal.removeClass('as-hidden');
        this.$puncturedModal.onInteractOut = onInteractOut;
    }
    else {
        this.$puncturedModal.follow(null);
        this.$puncturedModal.addClass('as-hidden');
        this.$puncturedModal.onInteractOut = null;
    }
};

BaseCommand.prototype.showTooltip = function (elt, message) {
    this.$tooltipContent.firstChild.data = message;
    this.tooltipToken = ToolTip.show(elt, this.$tooltipContent, 'auto');
    ToolTip.$holder.addClass('atr-on-top-1');
};

BaseCommand.prototype.showToast = function (message) {
    var toastElt = Toast.make({
        props: {
            message: message,
            htitle: 'Tutor',
            variant: 'sticky-note',
            timeText: ''
        }
    });
    this._tostElts.push(toastElt);
};

BaseCommand.prototype.closeAllToasts = function () {
    setTimeout(function () {
        this._tostElts.forEach(function (elt) {
            elt.disappear();
        });
    }.bind(this), 1000)
};


BaseCommand.prototype.closeTooltip = function () {
    if (this.tooltipToken) {
        ToolTip.closeTooltip(this.tooltipToken);
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


BaseCommand.prototype.ev_tutorPause = function () {
    this.pause();
};

BaseCommand.prototype.ev_tutorStop = function () {
    this.stop();
};


BaseCommand.attachEnv = function (tutor, env) {
};

export default BaseCommand;
