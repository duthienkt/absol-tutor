import UserBaseAction from "./UserBaseAction";
import TutorNameManager from "./TutorNameManager";
import OOP from "absol/src/HTML5/OOP";
import { compareDate, compareMonth, parseDateString } from "absol/src/Time/datetime";
import { $ } from "../dom/Core";
import TemplateString from "absol/src/JSMaker/TemplateString";
import * as datetime from "absol/src/Time/datetime";
import { inheritCommand } from "../engine/TCommand";
import TutorEngine from "./TutorEngine";
import BaseState from "./BaseState";

/***
 * @extends BaseState
 * @param {BaseCommand} command
 * @constructor
 */
function StateWaitCalendar(command) {
    BaseState.call(this, command);
    this.blindIdx = -1;
    this.checkIdx = -1;
}

OOP.mixClass(StateWaitCalendar, BaseState);


StateWaitCalendar.prototype.onStart = function () {
    var elt = this.command.elt;
    var message = this.args.message;
    var wrongMessage = this.args.wrongMessage;
    var inputTextHintFunc = this.args.inputTextHint && new Function('return ' + TemplateString.parse(this.args.inputTextHint).toJSCode());
    inputTextHintFunc = inputTextHintFunc || function () {
        return null;
    };
    if (this.command.hadWrongAction && wrongMessage)
        this.command.showTooltip(this.command.elt, wrongMessage);

    this.command.onlyClickTo(elt.$calendarBtn);
    this.command.elt.$calendarBtn.on('click', this.ev_click);
    this.command.highlightElt(elt);
    this.command.clickCb = this.ev_clickOut;
    this.blindIdx = setTimeout(function () {
        this.blindIdx = -1;
        this.command.highlightElt(elt.$calendarBtn);
    }.bind(this), 400);
};

StateWaitCalendar.prototype.onStop = function () {
    clearTimeout(this.blindIdx);
    clearTimeout(this.checkIdx);
    this.command.elt.$calendarBtn.off('click', this.ev_click);
};

StateWaitCalendar.prototype.checkCalendar = function () {
    var elt = this.command.elt;
    var isOn = !!(elt.share.$calendar && elt.share.$calendar.isDescendantOf(document.body));
    if (isOn) {
        this.goto('choose_date');
    }
}

StateWaitCalendar.prototype.ev_click = function () {
    this.checkIdx = setTimeout(this.checkCalendar.bind(this), 50);
};

StateWaitCalendar.prototype.ev_clickOut = function () {
    this.command.hadWrongAction = true;
    if (this.args.wrongMessage)
        this.command.showTooltip(this.command.elt, this.args.wrongMessage);
};


/***
 * @extends BaseState
 * @param {BaseCommand} command
 * @constructor
 */
export function StateChooseDate(command) {
    BaseState.call(this, command);
    this.blindIdx = -1;
    this.checkIdx = -1;
}

OOP.mixClass(StateChooseDate, BaseState);

StateChooseDate.prototype.onStart = function () {
    this.calendarElt = this.command.elt.share.$calendar;
    this.command.highlightElt(this.calendarElt);
    this.blindIdx = setTimeout(this.highlightTarget.bind(this), 400);
    this.command.onlyClickTo(this.calendarElt);
    document.addEventListener('click', this.ev_click);

};

StateChooseDate.prototype.onStop = function () {
    document.removeEventListener('click', this.ev_click);
    clearTimeout(this.blindIdx);
    clearTimeout(this.checkIdx);
};

StateChooseDate.prototype.highlightTarget = function () {
    var calendar = this.calendarElt;
    var value = this.args.value;
    var thisC = this.command;
    var viewDate = calendar._viewDate;
    if (!viewDate) return;
    var dM = compareMonth(value, viewDate);

    if (dM === 0) {
        $('.absol-chrome-calendar-week-in-month>div', calendar, function (dateElt) {
            if (dateElt.__date__ && datetime.compareDate(dateElt.__date__, value) === 0 && !dateElt.hasClass('absol-chrome-calendar-not-in-month')) {
                thisC.highlightElt(dateElt);
            }
        });
    }
    else if (dM < 0) {
        thisC.highlightElt(calendar.$prevBtn);
    }
    else if (dM > 0) {
        thisC.highlightElt(calendar.$nextBtn);
    }
};

StateChooseDate.prototype.checkCalendar = function () {
    var elt = this.command.elt;
    var isOn = !!(this.calendarElt && this.calendarElt.isDescendantOf(document.body));
    if (isOn) {
        this.highlightTarget();
    }
    else {
        this.goto('check_value');
    }
}

StateChooseDate.prototype.ev_click = function () {
    this.checkIdx = setTimeout(this.checkCalendar.bind(this), 50);
};


/***
 * @extends BaseState
 * @param {BaseCommand} command
 * @constructor
 */
export function StateCheckDateValue(command) {
    BaseState.call(this, command);

}

OOP.mixClass(StateCheckDateValue, BaseState);

StateCheckDateValue.prototype.onStart = function () {
    var value = this.args.value;
    var inputValue = this.command.elt.value;
    if (value === inputValue) {
        this.goto('finish');
    }
    else if (value && inputValue) {
        if (compareDate(value, inputValue) === 0) {
            this.goto('finish');
        }
        else {

            this.command.hadWrongAction = true;
            this.goto('user_begin');
        }
    }
};


//To do: user focus to input


/***
 * @extends UserBaseAction
 * @constructor
 */
function UserDateInput() {
    UserBaseAction.apply(this, arguments);
}

inheritCommand(UserDateInput, UserBaseAction);

UserDateInput.prototype.name = 'userDateInput';
UserDateInput.prototype.argNames = ['eltPath', 'value', 'message', 'wrongMessage', 'inputTextHint'];

UserDateInput.prototype.stateClasses['user_begin'] = StateWaitCalendar;
UserDateInput.prototype.stateClasses['choose_date'] = StateChooseDate;
UserDateInput.prototype.stateClasses['check_value'] = StateCheckDateValue;


UserDateInput.prototype._isFocus = function (elt) {
    return document.hasFocus() && document.activeElement === elt;
};

UserDateInput.prototype.verifyElt = function () {
    if (!this.elt.hasClass && !this.elt.hasClass('as-date-time-input')) {
        return new Error('Type error: not a date-input!')
    }
};

UserDateInput.prototype.requestUserAction = function () {
    var thisC = this;
    /***
     *
     * @type {DateInput2}
     */

    var elt = thisC.tutor.findNode(thisC.args.eltPath);
    this.assignTarget(elt);
    var message = this.args.message;
    var wrongMessage = this.args.wrongMessage;
    var inputTextHintFunc = this.args.inputTextHint && new Function('return ' + _TemplateString.default.parse(this.args.inputTextHint).toJSCode());

    inputTextHintFunc = inputTextHintFunc || function () {
        return null;
    };

    var inputTextHint;
    var value = this.args.value;
    return new Promise(function (resolve, reject) {
        thisC.onlyClickTo(elt);
        thisC.highlightElt(elt);
        var calendarOn = !!(elt.share.$calendar && elt.share.$calendar.isDescendantOf(document.body));
        /***
         * @type {ChromeCalendar}
         */

        var calendar;
        var lastKey;

        function onClick(event) {
            lastKey = null;
            checkCalendar();
            checkInput();
        }

        function onCalendarOpen() {
            calendar = elt.share.$calendar;
            thisC.onlyClickTo(elt.share.$calendar);
            thisC.highlightElt(elt.share.$calendar);
            onCalendarStep();
        }

        function onCalendarClose() {
            thisC.onlyClickTo(elt);
            thisC.highlightElt(elt);

            if (datetime.compareDate(elt.value, value) === 0) {
                clearListener();
                resolve();
            }
        }

        function onCalendarStep() {
            var viewDate = calendar._viewDate;
            if (!viewDate) return;
            var dM = compareMonth(value, viewDate);

            if (dM === 0) {
                $('.absol-chrome-calendar-week-in-mounth>div', calendar, function (dateElt) {
                    if (dateElt.__date__ && datetime.compareDate(dateElt.__date__, value) === 0 && !dateElt.containsClass('absol-chrome-calendar-not-in-month')) {
                        thisC.highlightElt(dateElt);
                    }
                });
            }
            else if (dM < 0) {
                thisC.highlightElt(calendar.$prevBtn);
            }
            else if (dM > 0) {
                thisC.highlightElt(calendar.$nextBtn);
            }
        }

        function checkCalendar() {
            setTimeout(function () {
                var isDisplay = !!(elt.share.$calendar && elt.share.$calendar.isDescendantOf(document.body));

                if (calendarOn !== isDisplay) {
                    calendarOn = isDisplay;

                    if (calendarOn) {
                        onCalendarOpen();
                    }
                    else {
                        onCalendarClose();
                    }
                }
                else if (calendarOn) {
                    onCalendarStep();
                }
            }, 10);
        }

        function onKeyUp(event) {
            lastKey = event.key;
            checkInput();
        }

        var prevented = false;

        function checkInput() {
            setTimeout(function () {
                inputTextHint = inputTextHintFunc.call(elt);

                if (thisC._isFocus(elt.$input) && lastKey !== 'Enter') {
                    thisC.highlightElt(null);
                    var text = elt.$input.value;

                    try {
                        var expectedValue = parseDateString(text, elt.format || 'dd/mm/yyyy');

                        if (!prevented && expectedValue && compareDate(expectedValue, value) === 0) {
                            function preventKey(event) {
                                if (event.key.length === 1 && !event.ctrlKey && !event.altKey) {
                                    event.preventDefault();
                                }
                            }

                            var checkIntv = setInterval(function () {
                                if (document.activeElement !== elt.$input) finishPrevent();
                            }, 100);
                            elt.$input.on('keydown', preventKey).on('blur', finishPrevent);

                            function finishPrevent() {
                                elt.$input.off('keydown', preventKey).off('blur', finishPrevent);
                                clearInterval(checkIntv);
                            }

                            resolve();
                        }
                        else {
                            if (inputTextHint) thisC.showTooltip(elt.$input, inputTextHint);
                        }
                    } catch (error) {
                        if (inputTextHint) thisC.showTooltip(elt.$input, inputTextHint);
                    }
                }
                else {
                    if (compareDate(elt.value, value) !== 0) {
                        if (wrongMessage) thisC.showTooltip(elt, wrongMessage);
                        if (lastKey !== 'Enter' && !(elt.share.$calendar && elt.share.$calendar.isDescendantOf(document.body))) thisC.highlightElt(elt);

                        if (lastKey === 'Enter') {
                            elt.$input.focus();
                            elt.$input.select && elt.$input.select();
                        }
                    }
                    else {
                        clearListener();
                        resolve();
                    }
                }
            }, 10);
        }

        function clearListener() {
            document.body.removeEventListener('click', onClick);
            document.body.removeEventListener('keyup', onKeyUp);
        }

        thisC._rejectCb = function () {
            clearListener();
            reject();
        };

        document.body.addEventListener('click', onClick);
        document.body.addEventListener('keyup', onKeyUp);
    });
};

UserDateInput.attachEnv = function (tutor, env) {
    env.userDateInput = function (eltPath, value, message, wrongMessage, inputTextHint) {
        if (!value || !value.toDateString) throw new Error("Invalid value, value must be a DateTime!");
        return new UserDateInput(tutor, {
            eltPath: eltPath,
            value: value,
            message: message,
            wrongMessage: wrongMessage,
            inputTextHint: inputTextHint
        }).exec();
    };
};

TutorEngine.installClass(UserDateInput);


TutorNameManager.addAsync('userDateInput');

export default UserDateInput;