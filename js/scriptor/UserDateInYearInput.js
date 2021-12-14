import UserBaseAction from "./UserBaseAction";
import TutorNameManager from "./TutorNameManager";
import OOP from "absol/src/HTML5/OOP";
import {compareDate, compareMonth, parseDateString} from "absol/src/Time/datetime";
import {$} from "../dom/Core";
import * as datetime from "absol/src/Time/datetime";
import DateInYearInput from "absol-acomp/js/DateInYearInput";


/***
 * @extends UserBaseAction
 * @constructor
 */
function UserDateInYearInput() {
    UserBaseAction.apply(this, arguments);
}

OOP.mixClass(UserDateInYearInput, UserBaseAction);


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


TutorNameManager.addAsync('userDateInYearInput');

export default UserDateInYearInput;