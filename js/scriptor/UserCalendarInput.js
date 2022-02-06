import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import ChromeCalendar from "absol-acomp/js/ChromeCalendar";
import TACData from "./TACData";
import UserBaseAction from "./UserBaseAction";
import { inheritCommand } from "../engine/TCommand";
import BaseState from "./BaseState";
import TutorEngine from "./TutorEngine";
import { StateCheckDateValue, StateChooseDate } from "./UserDateInput";

/***
 * @extends BaseState
 * @constructor
 */
function StateWaitCalendar() {
    BaseState.apply(this, arguments);
    this.clickTO = -1;
}

OOP.mixClass(StateWaitCalendar, BaseState);

StateWaitCalendar.prototype.onStart = function () {
    var elt = this.command.elt;
    var thisC = this.command;
    thisC.onlyClickTo(elt);
    thisC.highlightElt(elt);
    if (thisC.hadWrongAction && this.args.wrongMessage) {
        thisC.showTooltip(elt, thisC.args.wrongMessage);
    }

    document.addEventListener('click', this.ev_click);
};

StateWaitCalendar.prototype.onStop = function () {
    clearTimeout(this.clickTO);
    document.removeEventListener('click', this.ev_click);
};


StateWaitCalendar.prototype.ev_click = function () {
    var thisC = this.command;
    var elt = this.command.elt;
    thisC.highlightElt(null);
    if (this.clickTO >= 0) clearTimeout(this.clickTO);
    this.clickTO = setTimeout(function () {
        this.clickTO = -1;
        if (ChromeCalendar.$calendar && ChromeCalendar.$calendar.isDescendantOf(document.body)) {
            this.goto('choose_date');

        }
    }.bind(this), 100);
};

/***
 * @extends StateChooseDate
 * @constructor
 */
function StateChooseDate1() {
    StateChooseDate.apply(this, arguments);
    this.clickTO = -1;
}

OOP.mixClass(StateChooseDate1, StateChooseDate);

StateChooseDate1.prototype.onStart = function () {
    this.calendarElt = ChromeCalendar.$calendar;
    this.command.highlightElt(this.calendarElt);
    this.blindIdx = setTimeout(this.highlightTarget.bind(this), 400);
    this.command.onlyClickTo(this.calendarElt);
    document.addEventListener('click', this.ev_click);
};


/***
 * @extends BaseState
 * @constructor
 */
function StateWaitChange() {
    BaseState.apply(this, arguments);
}

OOP.mixClass(StateWaitChange, BaseState);




/***
 * @extends UserBaseAction
 * @constructor
 */
function UserCalendarInput() {
    UserBaseAction.apply(this, arguments);
}

inheritCommand(UserCalendarInput, UserBaseAction);

UserCalendarInput.prototype.className = 'UserCalendarInput';
UserCalendarInput.prototype.name = 'userCalendarInput';
UserCalendarInput.prototype.argNames = ['eltPath', 'value', 'message', 'wrongMessage'];
UserCalendarInput.prototype.stateClasses['user_begin'] = StateWaitCalendar;
UserCalendarInput.prototype.stateClasses['choose_date'] = StateChooseDate1;
UserCalendarInput.prototype.stateClasses['check_value'] = StateCheckDateValue;


UserCalendarInput.prototype.verifyElt = function () {
    var elt = this.elt;
    if (!elt.hasClass || !elt.hasClass('absol-calendar-input')) {
        return new Error("Invalid element type: not a CalendarInput!");
    }
    return null;
};

TutorEngine.installClass(UserCalendarInput);

TutorNameManager.addAsync('userCalendarInput');

TACData.define('userCalendarInput', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'value', type: 'Date' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' }
    ]
})

export default UserCalendarInput;