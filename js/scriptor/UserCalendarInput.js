import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import {compareDate} from "absol/src/Time/datetime";


/***
 * @extends BaseCommand
 * @constructor
 */
function UserCalendarInput() {
    BaseCommand.apply(this, arguments);

}

OOP.mixClass(UserCalendarInput, BaseCommand);


UserCalendarInput.prototype.exec = function () {
    var thisC = this;
    return new Promise(function (resolve, reject) {
        var elt = thisC.tutor.findNode(thisC.args.eltPath);
        var wrongMessage = thisC.args.wrongMessage;
        var value = thisC.args.value;
        thisC.onlyInteractWith(elt, function () {
            if (wrongMessage)
                thisC.showTooltip(elt, wrongMessage);
            thisC.highlightElt(elt);
        });

        function onChange(event) {
            if (compareDate(value, this.value) == 0) {
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
        thisC.onlyInteractWith(undefined);
        thisC.closeTooltip();
        thisC.highlightElt(undefined);
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