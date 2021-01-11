import TACData from "./TACData";
import UserBaseAction from "./UserBaseAction";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import UserSelectMenu from "./UserSelectMenu";
import MultiSelectMenu from "absol-acomp/js/MultiSelectMenu";

/***
 * @extends UserBaseAction
 * @constructor
 */
function UserMultiSelectMenu() {
    UserBaseAction.apply(this, arguments);

}

OOP.mixClass(UserMultiSelectMenu, UserBaseAction);

UserMultiSelectMenu.prototype._verifyMultiSelectMenu = function (elt) {
    if (!elt.containsClass || !elt.containsClass("as-multi-select-menu")) {
        throw new Error("Type error: not a MultiSelectMenu(SelectBox)");
    }
};

UserMultiSelectMenu.prototype._afterOpenList = UserSelectMenu.prototype._afterOpenList;

UserMultiSelectMenu.prototype._afterCloseList = UserSelectMenu.prototype._afterCloseList;

UserMultiSelectMenu.prototype._afterDelete = function (itemElt) {

};

/***
 *
 * @param {MultiSelectMenu} elt
 * @param values
 * @param wrongMessage
 * @param searchMessage
 * @returns {Promise}
 * @private
 */
UserMultiSelectMenu.prototype._afterChanged = function (elt, values, wrongMessage, searchMessage) {
    var thisC = this;
    this.highlightElt(elt);
    if (this.hadWrongAction) {
        if (wrongMessage)
            thisC.showTooltip(elt, wrongMessage);
    }
    this._clickCb = function () {
        if (wrongMessage)
            thisC.showTooltip(elt, wrongMessage);
    }
    this.onlyClickTo(elt);
    var valueDict = values.reduce(function (ac, cr) {
        ac[cr] = (ac[cr] || 0) + 1;
        return ac;
    });

    var wrongItem = undefined;
    var cValues = elt.values.slice();
    for (var i = 0; i < cValues.length; ++i) {
        if (valueDict[cValues[i]]) {
            wrongItem = cValues[i];
            break;
        }
    }

    if (wrongItem === undefined) {

    }
    else {

    }
};

UserMultiSelectMenu.prototype.requestUserAction = function () {
    var elt = this.tutor.findNode(this.args.eltPath);
    this._verifyMultiSelectMenu(elt);
    var values = this.args.values.slice();
    values.sort();
    if (elt.$selectlistBox && elt.$selectlistBox.findItemsByValue) {
        values.forEach(function (value) {
            var items = elt.$selectlistBox.findItemsByValue(value);
            if (!items || items.length === 0) {
                throw new Error("Not found value=" + (JSON.stringify(value) || value) + ' in SelectMenu');
            }
        })
    }

    var wrongMessage = this.args.wrongMessage;
    var searchMessage = this.args.searchMessage;

    return this._afterChanged(elt, values, wrongMessage, searchMessage);

}


UserMultiSelectMenu.attachEnv = function (tutor, env) {
    env.userMultiSelectMenu = function (eltPath, values, message, wrongMessage, searchMessage) {
        return new UserMultiSelectMenu(tutor, {
            eltPath: eltPath, values: values, message: message, wrongMessage: wrongMessage, searchMessage: searchMessage
        }).exec();
    };
};

TutorNameManager.addAsync('userMultiSelectMenu');

TACData.define('userMultiSelectMenu', {
    type: 'function',
    args: [
        { name: 'eltPath', type: '(string|AElement)' },
        { name: 'values', type: '(string|value)[]' },
        { name: 'message', type: 'string' },
        { name: 'wrongMessage', type: 'string' },
        { name: 'searchMessage', type: 'string' }
    ]
});


export default UserMultiSelectMenu;