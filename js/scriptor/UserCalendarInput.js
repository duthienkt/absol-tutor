import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import {compareDate} from "absol/src/Time/datetime";
import ChromeCalendar from "absol-acomp/js/ChromeCalendar";


/***
 * @extends BaseCommand
 * @constructor
 */
function UserCalendarInput() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(UserCalendarInput, BaseCommand);

UserCalendarInput.prototype._afterSelectCalendar = function (elt, requestValue, highlight) {
    var thisC = this;
    this.onlyInteractWith(elt);
    return new Promise(function (resolve) {
        if (highlight) {
            thisC.highlightElt(elt);
            if (thisC.args.wrongMessage) {
                thisC.showTooltip(elt, thisC.args.wrongMessage);
            }
        }

        var clickTimeout = -1;

        function onCLick() {
            if (clickTimeout >= 0) clearTimeout(clickTimeout);
            clickTimeout = setTimeout(function () {
                clickTimeout = -1;
                if (ChromeCalendar.$calendar && ChromeCalendar.$calendar.isDescendantOf(document.body)) {
                    if (highlight) {
                        thisC.highlightElt(ChromeCalendar.$calendar);
                        if (thisC.args.wrongMessage) {
                            thisC.showTooltip(ChromeCalendar.$calendar, thisC.args.wrongMessage);
                        }
                    }
                }
                else {
                    highlight = true;
                    thisC.onlyInteractWith(elt);
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
            if (compareDate(value, requestValue) == 0) {
                document.body.removeEventListener('click', onCLick);
                elt.off('change', onChange);
                setTimeout(resolve.bind(null, true), 10);
            }
            else{
                highlight = true;
                thisC.onlyInteractWith(elt);
                thisC.highlightElt(elt);
                if (thisC.args.wrongMessage) {
                    thisC.showTooltip(elt, thisC.args.wrongMessage);
                }
            }
        }

        elt.on('change', onChange);
        document.body.addEventListener('click', onCLick);
    });
};


UserCalendarInput.prototype.exec = function () {
    var thisC = this;
    this.start();
    var elt = thisC.tutor.findNode(thisC.args.eltPath);
    var value = this.args.value;
    this.showToast(this.args.message);
    return this._afterSelectCalendar(elt, value).then(function (){
        thisC.stop();
    });
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


export default UserCalendarInput;