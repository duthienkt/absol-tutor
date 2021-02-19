import UserBaseAction from "./UserBaseAction";
import TutorNameManager from "./TutorNameManager";
import OOP from "absol/src/HTML5/OOP";
import {hitElement} from "absol/src/HTML5/EventEmitter";
import ChromeCalendar from "absol-acomp/js/ChromeCalendar";
import {compareDate, compareMonth, parseDateString} from "absol/src/Time/datetime";
import {$} from "../dom/Core";
import TemplateString from "absol/src/JSMaker/TemplateString";

/***
 * @extends UserBaseAction
 * @constructor
 */
function UserDateInput() {
    UserBaseAction.apply(this, arguments);
}

OOP.mixClass(UserDateInput, UserBaseAction);


UserDateInput.prototype._isFocus = function (elt) {
    return document.hasFocus() && document.activeElement === elt;
};


UserDateInput.prototype.requestUserAction = function () {
    var thisC = this;
    /***
     *
     * @type {DateInput}
     */
    var elt = thisC.tutor.findNode(thisC.args.eltPath);
    this.assignTarget(elt);
    var message = this.args.message;
    var wrongMessage = this.args.wrongMessage;
    var inputTextHintFunc = this.args.inputTextHint
        && new Function('return ' + TemplateString.parse(this.args.inputTextHint).toJSCode());
    inputTextHintFunc = inputTextHintFunc || function () {
        return null;
    };
    var inputTextHint;
    var value = this.args.value;
    return new Promise(function (resolve, reject) {
        thisC.onlyClickTo(elt);
        thisC.highlightElt(elt);
        var calendarOn = !!(ChromeCalendar.$calendar && ChromeCalendar.$calendar.isDescendantOf(document.body));
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
            calendar = ChromeCalendar.$calendar;
            thisC.onlyClickTo(ChromeCalendar.$calendar);
            thisC.highlightElt(ChromeCalendar.$calendar);
            onCalendarStep();
        }

        function onCalendarClose() {
            thisC.onlyClickTo(elt);
            thisC.highlightElt(elt);
            if (compareDate(elt.value, value) === 0) {
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
                    if (compareDate(dateElt.__date__, value) === 0
                        && !dateElt.containsClass('absol-chrome-calendar-not-in-month')) {
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
                var isDisplay = !!(ChromeCalendar.$calendar && ChromeCalendar.$calendar.isDescendantOf(document.body));
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
                if (thisC._isFocus(elt.$input) && lastKey!== 'Enter') {
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
                                if (document.activeElement !== elt.$input)
                                    finishPrevent();
                            }, 100);
                            elt.$input.on('keydown', preventKey)
                                .on('blur', finishPrevent);

                            function finishPrevent() {
                                elt.$input.off('keydown', preventKey)
                                    .off('blur', finishPrevent);
                                clearInterval(checkIntv);
                            }

                            resolve();
                        }
                        else {
                            if (inputTextHint)
                                thisC.showTooltip(elt.$input, inputTextHint);
                        }
                    } catch (error) {
                        if (inputTextHint)
                            thisC.showTooltip(elt.$input, inputTextHint);
                    }

                }
                else {
                    if (compareDate(elt.value, value) !== 0) {
                        if (wrongMessage)
                            thisC.showTooltip(elt, wrongMessage);
                        if (lastKey !== 'Enter' &&!(ChromeCalendar.$calendar && ChromeCalendar.$calendar.isDescendantOf(document.body)))
                            thisC.highlightElt(elt);
                        if (lastKey === 'Enter'){
                            elt.$input.focus();
                            elt.$input.select && elt.$input.select();
                        }
                    }
                    else{
                        clearListener();
                        resolve();
                    }
                }
            }, 10)

        }

        function clearListener() {
            document.body.removeEventListener('click', onClick);
            document.body.removeEventListener('keyup', onKeyUp);
        }


        thisC._rejectCb = function () {
            clearListener();
            reject();
        }

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
    }
};


TutorNameManager.addAsync('userDateInput');

export default UserDateInput;