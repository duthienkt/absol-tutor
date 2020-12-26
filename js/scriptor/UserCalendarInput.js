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

UserCalendarInput.prototype._afterOpenCalendar = function () {
    var thisC = this;
    return new Promise(function (resolve) {
        function onCLick() {
            setTimeout(function () {
                console.log(ChromeCalendar.$calendar &&ChromeCalendar.$calendar.isDescendantOf(document.body))
            }, 30);
        }

        document.body.addEventListener('click', onCLick);
        // ChromeCalendar

    })
};


UserCalendarInput.prototype.exec = function () {
    var thisC = this;
    this.start();
    return new Promise(function (resolve, reject) {
        var elt = thisC.tutor.findNode(thisC.args.eltPath);
        var message = thisC.args.message;
        var wrongMessage = thisC.args.wrongMessage;

        thisC.showToast(message);
        var value = thisC.args.value;
        thisC.onlyInteractWith(elt, function () {
            if (wrongMessage)
                thisC.showTooltip(elt, wrongMessage);
            thisC.highlightElt(elt);
        });

        function onChange(event) {
            if (compareDate(value, this.value) === 0) {
                elt.off('change', onChange);
                resolve();
            }
            else {
                thisC.highlightElt(elt);
                if (wrongMessage)
                    thisC.showTooltip(elt, wrongMessage);
            }
        }

        elt.on('change', onChange);
    }).then(function () {
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