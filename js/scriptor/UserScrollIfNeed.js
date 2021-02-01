import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import {traceOutBoundingClientRect} from "absol/src/HTML5/Dom";
import TACData from "./TACData";
import TutorNameManager from "./TutorNameManager";
import {$, _} from "../dom/Core";
import {ScrollBarIco} from "../dom/Icon";
import ToolTip from "absol-acomp/js/Tooltip";

/***
 * @extends BaseCommand
 * @constructor
 */
function UserScrollIfNeed() {
    BaseCommand.apply(this, arguments);
    this._prevTootipDir = { dy: 0, dx: 0 };
}

OOP.mixClass(UserScrollIfNeed, BaseCommand);

UserScrollIfNeed.prototype.$scrollBarIcon = $(ScrollBarIco.cloneNode(true));
UserScrollIfNeed.prototype.$scrollBarIconCtn = _({
    class: 'atr-scroll-icon-ctn',
    child: UserScrollIfNeed.prototype.$scrollBarIcon
});

/***
 * @type {Tooltip}
 */
UserScrollIfNeed.prototype.$scrollTooltip = _({
    tag: ToolTip.tag,
    class: 'atr-scroll-tooltip',
    child: {
        class: 'atr-explain-text'
    }
});
UserScrollIfNeed.prototype.$scrollTooltipText = $('.atr-explain-text', UserScrollIfNeed.prototype.$scrollTooltip)


UserScrollIfNeed.prototype._showScroll = function (elt, dir) {
    this.$scrollBarIcon.removeClass('atr-down')
        .removeClass('atr-up')
        .removeStyle('transform');

    this.$scrollBarIconCtn.removeStyle('left')
        .removeStyle('top');
    if (elt && !this.$scrollBarIconCtn.parentElement)
        document.body.appendChild(this.$scrollBarIconCtn);
    else if (!elt && this.$scrollBarIconCtn.parentElement) {
        this.$scrollBarIconCtn.remove();
        return;
    }
    if (!dir) return;
    var bound = elt.getBoundingClientRect();
    var iconBound = this.$scrollBarIconCtn.getBoundingClientRect();
    if (dir.dy) {
        this.$scrollBarIconCtn.addStyle('left', bound.right - 17 - iconBound.width - 5 + 'px');
        if (dir.dy > 0) {
            this.$scrollBarIcon.addClass('atr-up');
            this.$scrollBarIconCtn.addStyle('top', bound.top + 'px');

        }
        else {
            this.$scrollBarIcon.addClass('atr-down');
            this.$scrollBarIconCtn.addStyle('top', bound.bottom - iconBound.height - 5 + 'px');

        }
    }
};

UserScrollIfNeed.prototype._showScrollTooltip = function (scroller, message, dir) {
    if (!message || !scroller) {
        this.$scrollTooltip.remove();
        return;
    }
    if (!this.$scrollTooltip.parentElement) document.body.appendChild(this.$scrollTooltip);
    var sBound = scroller.getBoundingClientRect();
    var messageElt = this.md2HTMLElements(message);
    this.$scrollTooltipText.clearChild()
        .addChild(messageElt);
    this.$scrollTooltip.addStyle('visibility', 'hidden');
    var tBound = this.$scrollTooltip.getBoundingClientRect();

    if (dir.dy > 0) {
        this.$scrollTooltip.removeClass('top')
            .addClass('bottom');
        this.$scrollTooltip.addStyle({
            left: sBound.left + sBound.width / 2 - tBound.width / 2 + 'px',
            top: sBound.top + 'px',
            visibility: 'visible'
        });
    }
    else {
        this.$scrollTooltip.removeClass('bottom')
            .addClass('top');
        this.$scrollTooltip.addStyle({
            left: sBound.left + sBound.width / 2 - tBound.width / 2 + 'px',
            top: sBound.bottom - tBound.height - 40 + 'px',
            visibility: 'visible'
        });
    }
};

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
    if (outBound.height < bound.height * 1.2 && outBound.height * 1.2 > bound.height) {
        var delta = outBound.height *  this.args.delta ;
        var outStart = outBound.top + delta;
        var outEnd = outBound.bottom - delta;
        var outX = outStart + this.args.offset * (outEnd - outStart);
        var x = bound.top + this.args.offset * bound.height;
        if (Math.abs(x - outX) > delta) {
            if (outEnd < x) {
                dy = -1;
            }
            else {
                dy = 1;
            }
        }
    }
    else if ((outBound.bottom < bound.bottom) !== (outBound.top > bound.top)) {
        if (outBound.bottom < bound.bottom) {
            dy = -1;
        }
        else if (outBound.top > bound.top) {
            dy = 1;
        }
    }
    if ((outBound.right < bound.right) !== (outBound.left > bound.left)) {
        if (outBound.right < bound.right) {
            dx = -1;
        }
        else if (outBound.left > bound.left) {
            dx = 1;
        }
    }
    return { dx: dx, dy: dy };
};

UserScrollIfNeed.prototype.onStop = function () {
    this._showScroll(null);
    BaseCommand.prototype.onStop.apply(this, arguments);
    this.$scrollBarIconCtn.remove();
    this.$scrollTooltip.remove();
};


UserScrollIfNeed.prototype.exec = function () {
    this.start();
    var thisC = this;
    var elt = this.tutor.findNode(this.args.eltPath);
    var message = this.args.message;
    var scrollUpMessage = this.args.scrollUpMessage;
    var scrollDownMessage = this.args.scrollDownMessage;
    var scrollDir = this._findScrollDir(elt);
    if (scrollDir.dy !== 0) {
        vScroller = this.findVScroller(elt, scrollDir.dy);
    }
    else {
        return Promise.resolve();
    }
    this.assignTarget(elt);
    this.showToast(message);
    this.highlightElt(elt);
    var vScroller;

    return new Promise(function (resolve, reject) {
        var checkTimeoutId = -1;
        var currentDir;

        function check() {
            checkTimeoutId = -1;
            currentDir = thisC._findScrollDir(elt);
            if (currentDir.dy === 0 || !vScroller) {
                thisC._rejectCb = null;
                if (vScroller) {
                    vScroller.removeEventListener('scroll', onScroll);
                    vScroller.removeClass('atr-scroll-only');
                }
                resolve();
            }
            else {
                thisC._showScroll(vScroller, currentDir);
                if (currentDir.dy > 0) {
                    if (thisC._prevTootipDir.dy <= 0) {
                        thisC._showScrollTooltip(vScroller, scrollUpMessage, currentDir);
                        thisC._prevTootipDir.dy = 1;
                    }
                }
                else {
                    if (thisC._prevTootipDir.dy >= 0) {
                        thisC._showScrollTooltip(vScroller, scrollDownMessage, currentDir);
                        thisC._prevTootipDir.dy = -1;
                    }
                }
            }

        }

        var prevScrollTop;

        function onScroll(event) {
            if (checkTimeoutId) {
                clearTimeout(checkTimeoutId);
            }
            currentDir = thisC._findScrollDir(elt);
            if (vScroller.scrollTop > prevScrollTop) {
                if (currentDir.dy > 0) {
                    thisC.hadWrongAction = true;
                }
            }
            else if (vScroller.scrollTop < prevScrollTop) {
                if (currentDir.dy < 0) {
                    thisC.hadWrongAction = true;
                }
            }


            prevScrollTop = vScroller.scrollTop;
            checkTimeoutId = setTimeout(check, 200);

        }

        if (vScroller) {
            prevScrollTop = vScroller.scrollTop;
            thisC._showScroll(vScroller, scrollDir);
            vScroller.addClass('atr-scroll-only');
            thisC.onlyClickTo(vScroller);
            vScroller.addEventListener('scroll', onScroll);
        }

        thisC._rejectCb = function () {
            if (checkTimeoutId) {
                clearTimeout(checkTimeoutId);
            }
            if (vScroller) {
                vScroller.removeEventListener('scroll', onScroll);
                vScroller.removeClass('atr-scroll-only');
            }
            reject();
        }
    }).then(this.stop.bind(this));
};

UserScrollIfNeed.attachEnv = function (tutor, env) {
    env.userScrollIfNeed = function (eltPath, message, scrollUpMessage, scrollDownMessage, offset) {
        return new UserScrollIfNeed(tutor, {
            eltPath: eltPath,
            message: message,
            scrollUpMessage: scrollUpMessage,
            scrollDownMessage: scrollDownMessage,
            offset: (typeof offset === 'number') ? (Math.max(0, Math.min(1, offset))) : 0.5,
            delta: (typeof offset === 'number') ? (Math.max(0, Math.min(1, offset))) : 0.2
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
        { name: 'scrollDownMessage', type: 'string' },
        { name: 'offset', type: 'number(0->1)' },
        { name: 'delta', type: 'number(0->1)' }
    ],
    desc: "Yêu cầu người dùng scroll, hiện giờ chỉ hỗ trợ scroll dọc"
});


export default UserScrollIfNeed;
