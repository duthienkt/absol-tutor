import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import Dom, { traceOutBoundingClientRect } from "absol/src/HTML5/Dom";
import TACData from "./TACData";
import TutorNameManager from "./TutorNameManager";
import { $, _ } from "../dom/Core";
import { ScrollBarIco } from "../dom/Icon";
import ToolTip from "absol-acomp/js/Tooltip";
import { inheritCommand } from "../engine/TCommand";
import TutorEngine from "./TutorEngine";
import UserBaseAction from "./UserBaseAction";
import BaseState from "./BaseState";

/***
 * @extends BaseState
 * @constructor
 */
function StateBeforeScroll() {
    BaseState.apply(this, arguments);
}

OOP.mixClass(StateBeforeScroll, BaseState);

StateBeforeScroll.prototype.onStart = function () {
    this.command.scrollerElt = this.command.findVScroller(this.command.elt);
    if (!this.command.scrollerElt) {
        this.goto('finish');
        return;
    }
    this.scrollDir = this.command.findScrollDir(this.command.elt, this.command.scrollerElt);
    if (this.scrollDir.dy === 0) {
        this.goto('finish');
        return;
    }
    this.command.highlightElt(this.command.elt);
    this.goto('begin_scrolling');
};


/***
 * @extends BaseState
 * @constructor
 */
function StateBeginScrolling() {
    BaseState.apply(this, arguments);
    this.checkIdx = -1;
    this.pointerLock = false;
    this.currentDir = 0;
}

OOP.mixClass(StateBeginScrolling, BaseState);

StateBeginScrolling.prototype.onStart = function () {
    this.command.scrollerElt.addEventListener('scroll', this.ev_scroll);
    document.addEventListener('scroll', this.ev_scroll);
    this.command.scrollerElt.classList.add('atr-scroll-only');

    document.body.addEventListener('pointerdown', this.ev_pointerDown);
    document.body.addEventListener('touchstart', this.ev_pointerDown);

    document.body.addEventListener('pointerup', this.ev_pointerUp);
    document.body.addEventListener('pointercancel', this.ev_pointerUp);
    document.body.addEventListener('touchend', this.ev_pointerUp);

    this.scrollDir = this.command.findScrollDir(this.command.elt, this.command.scrollerElt);
    this.prevScrollTop = this.command.scrollerElt.scrollTop;
    this.command._showScroll(this.command.scrollerElt, this.scrollDir);
    this.command.onlyClickTo(this.command.scrollerElt);
};

StateBeginScrolling.prototype.onStop = function () {
    this.command.scrollerElt.removeEventListener('scroll', this.ev_scroll);
    document.removeEventListener('scroll', this.ev_scroll);
    this.command.scrollerElt.classList.remove('atr-scroll-only');
    if (this.checkIdx > 0) clearTimeout(this.checkIdx);

    document.body.removeEventListener('pointerdown', this.ev_pointerDown);
    document.body.removeEventListener('touchstart', this.ev_pointerDown);

    document.body.removeEventListener('pointerup', this.ev_pointerUp);
    document.body.removeEventListener('pointercancel', this.ev_pointerUp);
    document.body.removeEventListener('touchend', this.ev_pointerUp);
};

StateBeginScrolling.prototype.delayCheck = function () {
    if (this.checkIdx > 0) {
        clearTimeout(this.checkIdx);
    }
    var thisC = this.command;
    var vScroller = this.command.scrollerElt;
    this.checkIdx = setTimeout(function () {
        this.checkIdx = -1;
        var currentDir = thisC.findScrollDir(this.command.elt, vScroller);
        this.currentDir = currentDir;
        var pointerLock = this.pointerLock;
        if (currentDir.dy === 0 || !vScroller) {
            thisC._showScrollTooltip(null);
            thisC._prevTootipDir = 0;
            if (!pointerLock) {
                this.goto('finish');
            }
        }
        else {
            thisC._showScroll(vScroller, currentDir);
            if (thisC._prevTootipDir.dy !== currentDir.dy) {
                thisC._showScrollTooltip(vScroller, currentDir.dy > 0 ? this.command.args.scrollUpMessage : this.command.args.scrollDownMessage, currentDir);
            }
            thisC._prevTootipDir.dy = currentDir.dy;
        }
    }.bind(this), 100);
};


StateBeginScrolling.prototype.ev_scroll = function (event) {
    this.command._updateToastPosition();

    this.currentDir = this.command.findScrollDir(this.command.elt, this.command.scrollerElt);
    var vScroller = this.command.scrollerElt;
    if (vScroller.scrollTop > this.prevScrollTop) {
        if (this.currentDir.dy > 0) {
            this.command.hadWrongAction = true;
        }
    }
    else if (vScroller.scrollTop < this.prevScrollTop) {
        if (this.currentDir.dy < 0) {
            this.command.hadWrongAction = true;
        }
    }


    this.prevScrollTop = this.command.scrollerElt.scrollTop;
    this.delayCheck();
};

StateBeginScrolling.prototype.ev_pointerUp = function () {
    this.pointerLock = true;
};

StateBeginScrolling.prototype.ev_pointerDown = function () {
    this.pointerLock = false;
};


/***
 * @extends BaseCommand
 * @constructor
 */
function UserScrollIfNeed() {
    BaseCommand.apply(this, arguments);
    this._prevTootipDir = { dy: 0, dx: 0 };
}

inheritCommand(UserScrollIfNeed, UserBaseAction);
UserScrollIfNeed.prototype.name = 'userScrollIfNeed';
UserScrollIfNeed.prototype.argNames = ['eltPath', 'message', 'scrollUpMessage', 'scrollDownMessage', 'offset', 'delta'];
UserScrollIfNeed.prototype.stateClasses['user_begin'] = StateBeforeScroll;
UserScrollIfNeed.prototype.stateClasses['begin_scrolling'] = StateBeginScrolling;


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
    if (!message || !scroller || !dir || !dir.dy) {
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


UserScrollIfNeed.prototype.findScrollDir = function (elt, scroller) {
    var outBound;
    if (scroller) {
        outBound = scroller.getBoundingClientRect();
    }
    else {
        outBound = traceOutBoundingClientRect(elt);
    }
    var bound = elt.getBoundingClientRect();
    var dx = 0;
    var dy = 0;
    if (outBound.height < bound.height * 1.2 && (true || outBound.height * 1.2 > bound.height)) {
        var delta = outBound.height * this.args.delta;
        var outStart = outBound.top + delta;
        var outEnd = outBound.bottom - delta;
        var outX = outStart + this.args.offset * (outEnd - outStart);
        var x = bound.top + this.args.offset * bound.height;
        if (Math.abs(x - outX) > delta) {
            if (outX < x) {
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


TutorEngine.installClass(UserScrollIfNeed);


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
