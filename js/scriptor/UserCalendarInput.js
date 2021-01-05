import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import {compareDate} from "absol/src/Time/datetime";
import ChromeCalendar from "absol-acomp/js/ChromeCalendar";
import TACData from "./TACData";
import UserBaseAction from "./UserBaseAction";


/***
 * @extends UserBaseAction
 * @constructor
 */
function UserCalendarInput() {
    UserBaseAction.apply(this, arguments);
    this._rejectCb = null;
}

OOP.mixClass(UserCalendarInput, UserBaseAction);

UserCalendarInput.prototype._afterSelectCalendar = function (elt, requestValue, highlight) {
    var thisC = this;
    this.onlyClickTo(elt);
    thisC.highlightElt(elt);
    return new Promise(function (resolve, reject) {
        if (highlight) {
            if (thisC.args.wrongMessage) {
                thisC.showTooltip(elt, thisC.args.wrongMessage);
            }
        }

        var clickTimeout = -1;

        function onCLick() {
            if (clickTimeout >= 0) clearTimeout(clickTimeout);
            thisC.highlightElt(null);
            clickTimeout = setTimeout(function () {
                clickTimeout = -1;
                if (ChromeCalendar.$calendar && ChromeCalendar.$calendar.isDescendantOf(document.body)) {
                    thisC.onlyClickTo(ChromeCalendar.$calendar);
                    if (highlight) {
                        if (thisC.args.wrongMessage) {
                            thisC.showTooltip(ChromeCalendar.$calendar, thisC.args.wrongMessage);
                        }
                    }
                }
                else {
                    highlight = true;
                    thisC.onlyClickTo(elt);
                    thisC.highlightElt(elt);
                    if (thisC.args.wrongMessage) {
                        thisC.showTooltip(elt, thisC.args.wrongMessage);
                    }

                }
            }, 30);
        }

        function onChange(event) {
            var value = event.value;
            if (clickTimeout >= 0) {
                clearTimeout(clickTimeout);
                clickTimeout = -1;
            }
            if (compareDate(value, requestValue) === 0) {
                document.body.removeEventListener('click', onCLick);
                elt.off('change', onChange);
                setTimeout(function () {
                    thisC._rejectCb = null;
                    resolve(true);
                }, 10);
            }
            else {
                highlight = true;
                thisC.onlyClickTo(elt);
                console.log("HL")
                thisC.highlightElt(elt);
                if (thisC.args.wrongMessage) {
                    thisC.showTooltip(elt, thisC.args.wrongMessage);
                }
            }
        }

        elt.on('change', onChange);
        setTimeout(function () {
            document.body.addEventListener('click', onCLick);
        }, 10);
        thisC._rejectCb = function () {
            if (clickTimeout >= 0) {
                clearTimeout(clickTimeout);
                clickTimeout = -1;
            }
            elt.off('change', onChange);
            document.body.removeEventListener('click', onCLick);
            reject();
        };
    });
};

UserCalendarInput.prototype.requestUserAction = function () {
    var thisC = this;
    var elt = thisC.tutor.findNode(thisC.args.eltPath);
    var value = this.args.value;
    return this._afterSelectCalendar(elt, value);
};


UserCalendarInput.attachEnv = function (tutor, env) {
    env.userCalendarInput = function (eltPath, value, message, wrongMessage) {
        return new UserCalendarInput(tutor, {
            eltPath: eltPath,
            value: new Date(value),
            message: message,
            wrongMessage: wrongMessage
        }).exec();
    };
};

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