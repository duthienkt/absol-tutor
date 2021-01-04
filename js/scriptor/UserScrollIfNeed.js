import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import {traceOutBoundingClientRect} from "absol/src/HTML5/Dom";
import TACData from "./TACData";
import TutorNameManager from "./TutorNameManager";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserScrollIfNeed() {
    BaseCommand.apply(this, arguments);
    this._scrollTrackingElts = [];
}

OOP.mixClass(UserScrollIfNeed, BaseCommand);


UserScrollIfNeed.prototype.findVScroller = function (elt, dY) {
    var parent = elt.parentElement;
    var overflowStyle;
    while (parent) {
        overflowStyle = window.getComputedStyle(parent)['overflow'];
        if ((overflowStyle === 'auto' || overflowStyle === 'hidden auto' || overflowStyle === 'scroll' || parent.tagName === 'HTML')
            && (parent.clientHeight < parent.scrollHeight)) {
            return parent;
        }
        parent = parent.parentElement;
    }
};

UserScrollIfNeed.prototype._findScrollDir = function (elt) {
    var outBound = traceOutBoundingClientRect(elt);
    var bound = elt.getBoundingClientRect();
    var dx = 0;
    var dy = 0;
    if (outBound.bottom < bound.bottom) {
        dy = -1;
    }
    else if (outBound.top > bound.top) {
        dy = 1;
    }
    if (outBound.right < bound.right) {
        dx = -1;
    }
    else if (outBound.left > bound.left) {
        dx = 1;
    }
    return { dx: dx, dy: dy };
};


UserScrollIfNeed.prototype.exec = function () {
    this.start();
    var thisC = this;
    var elt = this.tutor.findNode(this.args.eltPath);
    var message = this.args.message;
    var scrollUpMessage = this.args.scrollUpMessage;
    var scrollDownMessage = this.args.scrollDownMessage;
    var scrollDir = this._findScrollDir(elt);
    var vScroller;
    var hScroller;
    if (scrollDir.dy !== 0) {
        vScroller = this.findVScroller(elt, scrollDir.dy);
    }

    return new Promise(function (resolve, reject) {
        var checkTimeoutId = -1;
        var currentDir;
        function check(){
            currentDir = thisC._findScrollDir(elt);
            console.log(currentDir)
            if ((currentDir.dx === 0 || !hScroller) && (currentDir.dy === 0 || !vScroller)) {
                thisC._rejectCb = null;
                if (vScroller) {
                    vScroller.removeEventListener('scroll', onScroll);
                }
                resolve();
            }

        }
        function onScroll(event) {
            if (checkTimeoutId){
                clearTimeout(checkTimeoutId);
            }
            currentDir = thisC._findScrollDir(elt);
            checkTimeoutId = setTimeout(check, 200);

        }

        if (vScroller) {
            thisC.onlyClickTo(vScroller);
            vScroller.addEventListener('scroll', onScroll)
        }

        thisC._rejectCb = function () {
            if (checkTimeoutId){
                clearTimeout(checkTimeoutId);
            }
            if (vScroller) {
                vScroller.removeEventListener('scroll', onScroll);
            }
            reject();
        }
    }).then(this.stop.bind(this));
};

UserScrollIfNeed.attachEnv = function (tutor, env) {
    env.userScrollIfNeed = function (eltPath, message, scrollUpMessage, scrollDownMessage) {
        return new UserScrollIfNeed(tutor, {
            eltPath: eltPath,
            message: message,
            scrollUpMessage: scrollUpMessage,
            scrollDownMessage: scrollDownMessage
        }).exec();
    };
};

TutorNameManager.addAsync('userScrollIfNeed');

TACData.define('userScrollIfNeed', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'message', type: 'string' },
        { name: 'scrollUpMessage', type: 'string' },
        { name: 'scrollDownMessage', type: 'string' }
    ]
});


export default UserScrollIfNeed;
