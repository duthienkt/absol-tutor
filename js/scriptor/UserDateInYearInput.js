import UserBaseAction from "./UserBaseAction";
import TutorNameManager from "./TutorNameManager";
import OOP from "absol/src/HTML5/OOP";
import { inheritCommand } from "../engine/TCommand";
import BaseState from "./BaseState";
import TutorEngine from "./TutorEngine";
import { $$ } from "../dom/Core";
import Rectangle from "absol/src/Math/Rectangle";

/***
 * @extends BaseState
 * @constructor
 */
function StateWaitDMCalendar() {
    BaseState.apply(this, arguments);
    this.checkTO = -1;
}

OOP.mixClass(StateWaitDMCalendar, BaseState);


StateWaitDMCalendar.prototype.onStart = function () {
    this.command.highlightElt(this.command.elt);
    this.command.onlyClickTo(this.command.elt);
    this.command.clickCb = this.ev_clickOut;
    document.addEventListener('click', this.ev_click);
    if (this.command.hadWrongAction && this.args.wrongMessage){
        this.command.showTooltip(this.command.elt, this.args.wrongMessage);
    }
};


StateWaitDMCalendar.prototype.onStop = function () {
    this.command.clickCb = null;
    clearTimeout(this.checkTO);
    document.removeEventListener('click', this.ev_click);
};

StateWaitDMCalendar.prototype.ev_click = function () {
    this.checkTO = setTimeout(function () {
        if (this.command.elt.share.$picker && this.command.elt.share.$picker.isDescendantOf(document.body)) {
            this.goto('choose_month');
        }
    }.bind(this), 30);
};


StateWaitDMCalendar.prototype.ev_clickOut = function () {
    this.command.hadWrongAction = true;
    if (this.args.wrongMessage) {
        this.command.showTooltip(this.command.elt, this.args.wrongMessage);
    }
};


/***
 * @extends BaseState
 * @constructor
 */
function StateChooseMonth() {
    BaseState.apply(this, arguments);
    this.checkTO = -1;
    this.prevHighlightingElt = null;
}

OOP.mixClass(StateChooseMonth, BaseState);

StateChooseMonth.prototype.onStart = function () {
    this.command.highlightElt(this.command.elt.share.$picker);
    this.command.onlyClickTo(this.command.elt.share.$picker);

    this.checkTO = setTimeout(this.highlightMonth.bind(this), 400);
    this.command.$pickerCells = $$('.as-date-in-year-picker-cell', this.command.elt.share.$picker);
    this.command.$pickerCells[3].addStyle('pointer-events', 'none');
    if (this.command.hadWrongAction && this.args.wrongMessage){
        this.command.showTooltip(this.command.elt.share.$picker, this.args.wrongMessage);
    }
};

StateChooseMonth.prototype.onStop = function () {
    clearTimeout(this.checkTO);
    this.command.$pickerCells[3].removeStyle('pointer-events');

};

StateChooseMonth.prototype.highlightMonth = function () {
    var picker = this.command.elt.share.$picker;
    var month = this.args.value.month;
    if (picker.value && picker.value.month === month) {
        this.goto('choose_date');
        return;
    }
    var monthBtnList = this.command.elt.share.$picker.$months;
    var targetBtnList = [monthBtnList[month], monthBtnList[month + 12], monthBtnList[month + 24]];


    var monthScroller = this.command.elt.share.$picker.$monthScroller;
    var scrollerRect = Rectangle.fromClientRect(monthScroller.getBoundingClientRect());
    var scrollerCenterPoint = scrollerRect.centerPoint();
    var nearestBtn = targetBtnList.reduce(function (ac, cr) {
        var rect = Rectangle.fromClientRect(cr.getBoundingClientRect());
        var dist = rect.centerPoint().sub(scrollerCenterPoint).abs();
        if (dist < ac.dist) {
            ac.button = cr;
            ac.dist = dist;
        }
        return ac;
    }, { button: null, dist: Infinity }).button;
    var nearestRect = Rectangle.fromClientRect(nearestBtn.getBoundingClientRect());
    var needHighlightElt;
    if (nearestRect.collapsedSquare(scrollerRect) < nearestRect.square() * 0.8) {
        if (scrollerCenterPoint.sub(nearestRect.centerPoint()).y < 0) {
            needHighlightElt = this.command.elt.share.$picker.$monthDownBtn;
        }
        else {
            needHighlightElt = this.command.elt.share.$picker.$monthUpBtn;
        }
    }
    else {
        needHighlightElt = nearestBtn;
    }

    if (this.prevHighlightingElt !== needHighlightElt) {
        this.command.highlightElt(needHighlightElt);
        this.prevHighlightingElt = needHighlightElt;
    }

    this.checkTO = setTimeout(this.highlightMonth.bind(this), 100);
};


/***
 * @extends BaseState
 * @constructor
 */
function StateChooseDate() {
    BaseState.apply(this, arguments);
    this.checkTO = -1;
    this.prevHighlightElt = null;
}

OOP.mixClass(StateChooseDate, BaseState);


StateChooseDate.prototype.onStart = function () {
    this.$picker = this.command.elt.share.$picker;
    this.command.onlyClickTo(this.command.elt.share.$picker);

    this.checkTO = setTimeout(this.check.bind(this), 400);
    this.command.$pickerCells = $$('.as-date-in-year-picker-cell', this.command.elt.share.$picker);
    this.command.$pickerCells[2].addStyle('pointer-events', 'none');
    this.command.highlightElt(this.command.$pickerCells[3].firstChild);
    if (this.command.hadWrongAction && this.args.wrongMessage){
        this.command.showTooltip(this.command.elt.share.$picker, this.args.wrongMessage);
    }
};


StateChooseDate.prototype.onStop = function () {
    clearTimeout(this.checkTO);
    this.command.$pickerCells[2].removeStyle('pointer-events');
};


StateChooseDate.prototype.check = function () {
    if (this.$picker.value && this.$picker.value.date === this.args.value.date) {
        this.goto('wait_confirm');
        return;
    }

    if (!this.prevHighlightElt) {
        this.prevHighlightElt = this.$picker.$days[this.args.value.date - 1];
        this.command.highlightElt(this.prevHighlightElt)
    }

    this.checkTO = setTimeout(this.check.bind(this), 100);

};


/***
 * @extends BaseState
 * @constructor
 */
function StateWaitConfirm() {
    BaseState.apply(this, arguments);
    this.checkTO = -1;
}

OOP.mixClass(StateWaitConfirm, BaseState);

StateWaitConfirm.prototype.onStart = function () {
    this.command.elt.share.$picker.addClass('atr-scroll-only');
    this.command.elt.share.$picker.addStyle('cursor', 'not-allowed');
    this.command.highlightElt(this.command.elt);
    document.addEventListener('click', this.ev_click);
    if (this.args.finishMessage){
        this.command.showTooltip(this.command.elt, this.args.finishMessage);
    }
};


StateWaitConfirm.prototype.onStop = function () {
    this.command.elt.share.$picker.removeClass('atr-scroll-only');
    this.command.elt.share.$picker.removeStyle('cursor');
    document.removeEventListener('click', this.ev_click);
};


StateWaitConfirm.prototype.ev_click = function () {
    this.checkTO = setTimeout(function () {
        if (!this.command.elt.share.$picker.isDescendantOf(document.body)) {
            this.goto('finish');
        }
    }.bind(this), 30);
};


/***
 * @extends UserBaseAction
 * @constructor
 */
function UserDateInYearInput() {
    UserBaseAction.apply(this, arguments);
}

inheritCommand(UserDateInYearInput, UserBaseAction);

UserDateInYearInput.prototype.className = 'UserDateInYearInput';
UserDateInYearInput.prototype.name = 'userDateInYearInput';
UserDateInYearInput.prototype.argNames = ['eltPath', 'value', 'message', 'wrongMessage', 'finishMessage'];
UserDateInYearInput.prototype.stateClasses['user_begin'] = StateWaitDMCalendar;
UserDateInYearInput.prototype.stateClasses['choose_month'] = StateChooseMonth;
UserDateInYearInput.prototype.stateClasses['choose_date'] = StateChooseDate;
UserDateInYearInput.prototype.stateClasses['wait_confirm'] = StateWaitConfirm;


UserDateInYearInput.prototype._isFocus = function (elt) {
    return document.hasFocus() && document.activeElement === elt;
};

UserDateInYearInput.prototype._waitOpenPicker = function () {
    var self = this;
    var elt = this.elt;
    return new Promise(function (resolve, reject) {
        function onClick() {
            setTimeout(function () {
                if (elt.share.$picker && elt.share.$picker.isDescendantOf(document.body)) {
                    document.removeEventListener('click', onClick);
                    self._rejectCb = null;
                    resolve();
                }
            }, 10);
        }

        document.addEventListener('click', onClick);
        self._rejectCb = function () {
            document.removeEventListener('click', onClick);
            reject();
        }
    });
};

UserDateInYearInput.prototype._blinkCalendar = function () {
    var self = this;
    this._lockPicker();
    return new Promise(function (resolve, reject) {
        self.highlightElt(self.elt.share.$picker);
        self.onlyClickTo(self.elt.share.$picker);
        setTimeout(resolve, 500);
        self._rejectCb = function () {
            self._unlockPicker();
            reject();
        };
    });
};

UserDateInYearInput.prototype._lockPicker = function () {
    document.removeEventListener('click', this.elt.eventHandler.clickOut);
};

UserDateInYearInput.prototype._unlockPicker = function () {
    document.addEventListener('click', this.elt.eventHandler.clickOut);
};

UserDateInYearInput.prototype._waitChooseMonth = function () {
    var self = this;
    var value = this.args.value;
    return new Promise(function (resolve, reject) {
        self.highlightElt(null);
        self.elt.share.$picker.$months[value.month - 1 + 12].scrollIntoView();
        self.highlightElt(self.elt.share.$picker.$months[value.month - 1 + 12]);
        self.onlyClickTo(self.elt.share.$picker.$months[value.month - 1 + 12]);
        self._clickCb = function () {
            self.showTooltip(self.elt.share.$picker.$months[value.month - 1 + 12], self.args.wrongMessage);
        }

        function onClick() {
            self._clickCb = null;
            resolve();
        }

        self.elt.share.$picker.$months[value.month - 1 + 12].once('click', onClick);
        self._rejectCb = function () {
            self.elt.share.$picker.$months[value.month - 1 + 12].off('click', onClick);
            self._unlockPicker();
            reject();
        }
    });
};

UserDateInYearInput.prototype._waitChooseDate = function () {
    var self = this;
    var value = this.args.value;
    return new Promise(function (resolve, reject) {
        var dateElt = self.elt.share.$picker.$days[value.date - 1];
        self.highlightElt(dateElt);
        self.onlyClickTo(dateElt);

        function onClick() {
            resolve();
        }

        dateElt.once('click', onClick);
        self._rejectCb = function () {
            self._unlockPicker();
            dateElt.off('click', onClick);
            self.highlightElt(null);
            reject();
        }
    });
};

UserDateInYearInput.prototype._waitClose = function () {
    var self = this;
    return new Promise(function (resolve, reject) {
        self.highlightElt(self.elt);
        self.onlyClickTo(self.elt);
        var notNull = self.elt.notNull;
        self.elt.notNull = true;

        function onCLick(event) {
            self.elt.eventHandler.clickOut(event);
            self.elt.notNull = notNull;
            resolve();
        }

        self._clickCb = function () {
            self.showTooltip(self.elt, self.args.finishMessage || "Nhấn vào đây để xác nhận giá trị vừa chọn")
        };

        self.elt.once('click', onCLick);
        self._rejectCb = function () {
            self.elt.off('click', onCLick);
            self.elt.notNull = notNull;
            reject();
        }
    });
};

UserDateInYearInput.prototype.requestUserAction = function () {
    var thisC = this;
    /***
     *
     * @type {DateInYearInput}
     */

    var elt = thisC.tutor.findNode(thisC.args.eltPath);
    this.elt = elt;
    this.assignTarget(elt);
    var message = this.args.message;
    var wrongMessage = this.args.wrongMessage;
    this.highlightElt(elt);
    this.onlyClickTo(elt);
    this._clickCb = function () {
        this.showTooltip(elt, wrongMessage);
    }.bind(this);

    return this._waitOpenPicker()
        .then(this._blinkCalendar.bind(this))
        .then(this._waitChooseMonth.bind(this))
        .then(this._waitChooseDate.bind(this))
        .then(this._waitClose.bind(this));
};

UserDateInYearInput.attachEnv = function (tutor, env) {
    env.userDateInYearInput = function (eltPath, value, message, wrongMessage, finishMessage) {
        return new UserDateInYearInput(tutor, {
            eltPath: eltPath,
            value: value,
            message: message,
            wrongMessage: wrongMessage,
            finishMessage: finishMessage
        }).exec();
    };
};


TutorEngine.installClass(UserDateInYearInput);

TutorNameManager.addAsync('userDateInYearInput');

export default UserDateInYearInput;