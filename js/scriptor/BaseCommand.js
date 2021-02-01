import '../../css/basecommand.css';
import {$, _} from "../dom/Core";
import wrapAsync from "../util/wrapAsync";
import ToolTip from "absol-acomp/js/Tooltip";
import Toast from "absol-acomp/js/Toast";
import Context from "absol/src/AppPattern/Context";
import OOP from "absol/src/HTML5/OOP";
import {Converter} from 'showdown';
import {hitElement} from "absol/src/HTML5/EventEmitter";
import Vec2 from "absol/src/Math/Vec2";
import Rectangle from "absol/src/Math/Rectangle";
import BlinkMask from "../dom/BlinkMask";
import {getScreenSize} from "absol/src/HTML5/Dom";

var showdownConverter = new Converter();

/***
 * @typedef {{eltPath:string, message:string, wrongMessage:string, text: string, query: string, value:(string|number|null), until:(BaseCommand|(function():Promise))}} TutorCommandArgs
 */

/***
 * @extends Context
 * @param tutor
 * @param {TutorCommandArgs} args
 * @constructor
 */
function BaseCommand(tutor, args) {
    Context.call(this);
    /***
     * @type Tutor
     */
    this.tutor = tutor;
    /***
     * @type {TutorCommandArgs}
     */
    this.args = args;
    this.tooltipToken = null;
    this._tostElts = [];
    this.hadWrongAction = false;

    this.$target = null;
    this._currentTostPosition = 'se';

    /** KeyBoard **/
    this._ev_docKeyboard = this.ev_docKeyboard.bind(this);
    this._keyboardPrevented = false;


    /***
     * only call if prevented keyboard
     * @type {function():void}
     * @protected
     */
    this._keyCb = null;
    /** Mouse **/
    this.ev_clickModal = this.ev_clickModal.bind(this);

    /***
     * only call if prevented mouse
     * @type {function():void}
     * @protected
     */
    this._clickCb = null;


    /***
     * @type {function():void}
     * @protected
     */
    this._rejectCb = null;
}

OOP.mixClass(BaseCommand, Context);

BaseCommand.prototype.$htmlRender = _('div');

/***
 * @type BlinkMask
 */
BaseCommand.prototype.$highlightModal = _({
    tag: BlinkMask.tag,
    class: ['atr-explain-modal', 'as-non-interact', 'as-animation']
});

BaseCommand.prototype.$puncturedModal = _({
    tag: 'puncturedmodal',
    class: 'as-transparent',
    props: {
        onInteractOut: null,
    }
});

BaseCommand.prototype.$transparentModal = _('.atr-transparent-modal.as-hidden');

BaseCommand.prototype.$tooltipContent = _({
    class: 'atr-explain-text'
});

/***
 *
 * @param {KeyboardEvent} event
 */
BaseCommand.prototype.ev_docKeyboard = function (event) {
    this.hadWrongAction = true;
    event.preventDefault();
    if (this._keyCb) {
        this._keyCb();
    }
};

BaseCommand.prototype.ev_clickModal = function (event) {
    this.hadWrongAction = true;
    if (this._clickCb)
        this._clickCb();
};


/***
 * @param {HTMLElement} elt
 * @param {MouseEvent} event
 */
BaseCommand.prototype.hitSomeOf = function (elt, event) {
    if (hitElement(elt, event)) return false;
    var bound = Rectangle.fromClientRect(elt.getBoundingClientRect());
    var p = new Vec2(event.clientX, event.clientY);
    if (!bound.containsPoint(p)) return false;
    var id = elt.getAttribute('data-tutor-id') || elt['data-tutor-id'];
    if (!id) return false;
    var target = event.target;
    var tId;
    while (target) {
        tId = target.getAttribute('data-tutor-id') || target['data-tutor-id'];
        if (tId === id) return elt !== target;
        target = target.parentElement;
    }
    return false;
};


BaseCommand.prototype.onStart = function () {
    this.tutor.commandPush(this);
    this.$puncturedModal.on('click', this.ev_clickModal);
    this.$transparentModal.on('click', this.ev_clickModal);
};


BaseCommand.prototype.cancel = function () {
    if (this._rejectCb) {
        this._rejectCb();
        this._rejectCb = null;
    }
};

BaseCommand.prototype.onStop = function () {
    /** modal **/
    this.$puncturedModal.off('click', this.ev_clickModal);
    this.$transparentModal.off('click', this.ev_clickModal);

    this._clickCb = null;
    this._keyCb = null;

    this.cancel && this.cancel();
    this.closeTooltip();
    this.closeAllToasts();
    this.highlightElt(null);
    this.onlyClickTo(null);
    this.preventMouse(false);
    this.preventKeyBoard(false);
    this.tutor.commandPop(this);
};


BaseCommand.prototype.md2HTMLElements = function (text) {
    this.$htmlRender.innerHTML = showdownConverter.makeHtml(text);
    return Array.prototype.slice.call(this.$htmlRender.childNodes);
};

BaseCommand.prototype.preventMouse = function (flag) {
    if (!this.$transparentModal.parentElement) {
        document.body.appendChild(this.$transparentModal);
    }
    if (flag) {
        this.$transparentModal.removeClass('as-hidden');
    }
    else {
        this.$transparentModal.addClass('as-hidden');

    }
};

BaseCommand.prototype.preventKeyBoard = function (flag) {
    if (flag) {
        if (!this._keyboardPrevented) {
            this._keyboardPrevented = true;
            document.addEventListener('keydown', this.ev_docKeyboard);
        }
    }
    else {
        if (this._keyboardPrevented) {
            this._keyboardPrevented = false;
            document.removeEventListener('keydown', this.ev_docKeyboard);
        }
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

BaseCommand.prototype.onlyClickTo = function (elt) {
    if (!this.$puncturedModal.parentElement) {
        document.body.appendChild(this.$puncturedModal);
    }
    if (elt) {
        this.$puncturedModal.follow(elt);
        this.$puncturedModal.removeClass('as-hidden');
    }
    else {
        this.$puncturedModal.follow(null);
        this.$puncturedModal.addClass('as-hidden');
        this.$puncturedModal.onInteractOut = null;
    }
};

/***
 *
 * @param {string} message
 */
BaseCommand.prototype.showDelayToast = function (message) {
    var thisC = this;
    this.preventMouse(true);
    this.showToast(message);
    return new Promise(function (resolve, reject) {
        var resolveTimoutId = setTimeout(function () {
            thisC._rejectCb = null;
            thisC.preventMouse(false);
            resolve();

        }, thisC.tutor.option.messageDelay);
        thisC._rejectCb = function () {
            clearTimeout(resolveTimoutId);
            reject();
        }
    });
};

BaseCommand.prototype.showTooltip = function (elt, message) {
    if (typeof message !== "string") return;
    var eltList = this.md2HTMLElements(message)
    this.$tooltipContent.clearChild();
    eltList.forEach(function (elt) {
        this.$tooltipContent.addChild(elt);
    }.bind(this));
    this.tooltipToken = ToolTip.show(elt, this.$tooltipContent, 'auto');
    ToolTip.$holder.addClass('atr-on-top-1');
};

/***
 *
 * @param {string} message
 */
BaseCommand.prototype.showToast = function (message) {
    if (typeof message !== "string") return;
    var pos = this._currentTostPosition;

    var toastElt = Toast.make({
        class: ['as-variant-background', 'atr-toast-message'],
        props: {
            htitle: 'Tutor',
            variant: 'sticky-note',
            timeText: ''
        },
        child: this.md2HTMLElements(message)

    }, pos);
    this._tostElts.push(toastElt);
    this._updateToastPosition();
};

BaseCommand.prototype.closeAllToasts = function () {
    setTimeout(function () {
        this._tostElts.forEach(function (elt) {
            elt.disappear();
        });
    }.bind(this), 1000)
};

BaseCommand.prototype.assignTarget = function (targetElt) {
    this.$target = targetElt;
    this._updateToastPosition();
};

BaseCommand.prototype._updateToastPosition = function () {
    var targetElt = this.$target;
    if (targetElt) {
        var bound = targetElt.getBoundingClientRect();
        var screenSize = getScreenSize();
        var toastListElt = Toast.$toastList4Pos[this._currentTostPosition];
        var toastListBound = toastListElt.getBoundingClientRect();
        var boundRect = Rectangle.fromClientRect(bound);
        var roastListRect = Rectangle.fromClientRect(toastListBound);
        var isOverlay = roastListRect.isCollapse(boundRect);


        if (this._currentTostPosition === 'se' && bound.left + 400 >= screenSize.width && (bound.top + 150 >= screenSize.height || isOverlay)) {
            this._currentTostPosition = 'sw';
        }
        else if (this._currentTostPosition === 'sw' && bound.left <= 400 && (bound.top + 150 >= screenSize.height || isOverlay)) {
            this._currentTostPosition = 'se';
        }
        this._tostElts.forEach(function (elt) {
            if (!elt.parentElement || elt.parentElement === toastListElt) return;
            toastListElt.addChild(elt);
        });
    }
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


/***
 *
 * @param {string|AElement} query
 * @param {boolean=} unsafe
 * @return {AElement}
 */
BaseCommand.prototype.findNode = function (query, unsafe) {
    return this.tutor.findNode(query, unsafe);
};

BaseCommand.attachEnv = function (tutor, env) {
};

export default BaseCommand;
