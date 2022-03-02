import TACData from "./TACData";
import UserBaseAction from "./UserBaseAction";
import OOP from "absol/src/HTML5/OOP";
import TutorNameManager from "./TutorNameManager";
import BaseState from "./BaseState";
import TutorEngine from "./TutorEngine";
import { inheritCommand } from "../engine/TCommand";
import ToolTip from "absol-acomp/js/Tooltip";

/***
 * @extends BaseState
 * @constructor
 */
function StateWaitDropdown() {
    BaseState.apply(this, arguments);
    this.checkTO = -1;
}


OOP.mixClass(StateWaitDropdown, BaseState);

StateWaitDropdown.prototype.onStart = function () {
    this.command.highlightElt(this.command.elt);
    this.command.clickCb = this.ev_clickOut;
    this.command.onlyClickTo(this.command.elt);
    this.command.elt.on('click', this.ev_click);
    if (this.command.hadWrongAction && this.args.wrongMessage) {
        this.command.showTooltip(this.command.elt, this.args.wrongMessage);
    }
};


StateWaitDropdown.prototype.onStop = function () {
    if (this.checkTO > 0) clearTimeout(this.checkTO);
    this.command.elt.off('click', this.ev_click);
    this.command.clickCb = null;
};

StateWaitDropdown.prototype.delayCheck = function () {
    if (this.checkTO > 0) clearTimeout(this.checkTO);
    this.checkTO = setTimeout(function () {
        this.checkTO = -1;
        if (this.command.elt.$selectlistBox.isDescendantOf(document.body)) {
            this.goto('wait_pick_item');
        }
    }.bind(this), 10);
};

StateWaitDropdown.prototype.ev_click = function () {
    this.delayCheck();
};

StateWaitDropdown.prototype.ev_clickOut = function () {
    this.command.hadWrongAction = true;
    if (this.args.wrongMessage) {
        this.command.showTooltip(this.command.elt, this.args.wrongMessage);
    }
};

/***
 * @extends BaseState
 * @constructor
 */
function StateWaitPickItem() {
    BaseState.apply(this, arguments);
    this.blinkTO = -1;
}


OOP.mixClass(StateWaitPickItem, BaseState);


OOP.mixClass(StateWaitPickItem, BaseState);

StateWaitPickItem.prototype.onStart = function () {
    document.body.addEventListener('mousedown', this.ev_click);
    this.command.highlightElt(this.command.elt.$selectlistBox);
    this.command.onlyClickTo(this.command.elt.$selectlistBox);
    this.command.clickCb = this.ev_clickOut;
    this.blinkTO = setTimeout(function () {
        this.blinkTO = -1;
        this.command.highlightElt(null);

    }.bind(this), 1000);
};


StateWaitPickItem.prototype.onStop = function () {
    document.body.removeEventListener('mousedown', this.ev_click);
    if (this.checkTO > 0) clearTimeout(this.checkTO);
    if (this.blinkTO > 0) clearTimeout(this.blinkTO);
    this.command.clickCb = null;

};

StateWaitPickItem.prototype.delayCheck = function () {
    if (this.checkTO > 0) clearTimeout(this.checkTO);
    this.checkTO = setTimeout(function () {
        this.checkTO = -1;
        if (!this.command.elt.$selectlistBox.isDescendantOf(document.body)) {
            this.goto('check_values');
        }
    }.bind(this), 100);
};


StateWaitPickItem.prototype.ev_click = function () {
    this.delayCheck();
};

StateWaitPickItem.prototype.ev_clickOut = function () {
    this.command.hadWrongAction = true;
};


/***
 * @extends BaseState
 * @constructor
 */
function StateCheckValues() {
    BaseState.apply(this, arguments);
    this.checkTO = -1;
}


OOP.mixClass(StateCheckValues, BaseState);

StateCheckValues.prototype.onStart = function () {
    this.command.onlyClickTo(this.command.elt);
    var values = this.command.elt.values.slice();
    var requireValues = this.command.args.values || [];
    var requireDict = requireValues.reduce(function (ac, cr){
        ac[cr] = true;
        return ac;
    }, {})
    for (var i = 0; i < values.length; ++i) {
        if (!requireDict[values[i]]) {
            this.command.needRemoveValue = values[i];
            this.goto('remove_item');
            return;
        }
    }
    if  (values.length < requireValues.length){
        this.goto('user_begin');
    }
    else {
        this.goto('finish');
    }
};


/***
 * @extends BaseState
 * @constructor
 */
function StateRemoveItem() {
    BaseState.apply(this, arguments);
    this.checkTO = -1;
    this.blinkTO = -1;
}


OOP.mixClass(StateRemoveItem, BaseState);

StateRemoveItem.prototype.onStart = function () {
    this.updateItem();
    this.command.elt.on('change', this.ev_change);
    this.command.clickCb = this.ev_clickOut;
};

StateRemoveItem.prototype.onStop = function () {
    if (this.blinkTO > 0) {
        clearTimeout(this.blinkTO);
    }
    this.command.highlightElt(null);
    this.command.elt.off('change', this.ev_change);

};


StateRemoveItem.prototype.updateItem = function () {
    var value = this.command.needRemoveValue;
    this.needRemoveElt = this.command.elt.$items.find(function (elt) {
        return elt.value === value;
    });
    if (this.needRemoveElt) {
        this.command.highlightElt(this.needRemoveElt.$close);
        this.command.onlyClickTo(this.needRemoveElt.$close);
    }
    else {
        this.command.needRemoveValue = null;
        this.goto('check_values');
    }
};

StateRemoveItem.prototype.blinkElt = function (elt) {
    if (this.blinkTO > 0) clearTimeout(this.blinkTO);
    this.command.highlightElt(elt);
    this.blinkTO = setTimeout(function () {
        this.blinkTO = -1;
        this.command.highlightElt(null);
    }.bind(this), 500);
};



StateRemoveItem.prototype.ev_change = function (){
    ToolTip.updatePosition();
    this.goto('check_values');
};


StateRemoveItem.prototype.ev_clickOut = function () {
    this.command.hadWrongAction = true;
    if (this.args.wrongMessage) {
        this.command.showTooltip(this.command.elt, this.args.wrongMessage);
    }
};


/***
 * @extends UserBaseAction
 * @constructor
 */
function UserMultiSelectMenu() {
    UserBaseAction.apply(this, arguments);
}

inheritCommand(UserMultiSelectMenu, UserBaseAction);

UserMultiSelectMenu.prototype.name = 'userMultiSelectMenu';
UserMultiSelectMenu.prototype.className = 'UserMultiSelectMenu';
UserMultiSelectMenu.prototype.argNames = ['eltPath', 'values', 'message', 'wrongMessage', 'searchMessage'];
UserMultiSelectMenu.prototype.stateClasses['user_begin'] = StateWaitDropdown;
UserMultiSelectMenu.prototype.stateClasses['wait_pick_item'] = StateWaitPickItem;
UserMultiSelectMenu.prototype.stateClasses['check_values'] = StateCheckValues;
UserMultiSelectMenu.prototype.stateClasses['remove_item'] = StateRemoveItem;


//
// UserMultiSelectMenu.prototype.nextActionState = function (stateName) {
//     this.actionState = stateName;
//     this.emitter.emit.apply(this.emitter, arguments);
// };

//
// UserMultiSelectMenu.prototype._verifyMultiSelectMenu = function (elt) {
//     if (!elt.containsClass || !elt.containsClass("as-multi-select-menu")) {
//         throw new Error("Type error: not a MultiSelectMenu(SelectBox)");
//     }
// };//10p

//
// UserMultiSelectMenu.prototype.onStateEntry = function () {
//     var thisC = this;
//     this.onlyClickTo(this.elt);
//     this.ifClickModal(function () {
//         thisC.hadWrongAction = true;
//         thisC.highlightElt(this.elt);
//     });
//
//     function onClick() {
//         if (thisC.elt.isFocus) {
//             thisC.elt.off('click', onClick);
//             thisC.ifClickModal(null);
//             thisC.highlightElt(null);
//             thisC.nextActionState('open_dropdown');
//         }
//     }
//
//     this.elt.on('click', onClick);
// };
//
//
// UserMultiSelectMenu.prototype.onStateOpenDropDown = function () {
//     var thisC = this;
//     this.onlyClickTo(this.elt.$selectlistBox);
//
//     function onMouseUp() {
//         setTimeout(function () {
//             if (thisC.elt.isFocus) {
//
//             }
//             else {
//                 document.removeEventListener('mouseup', onMouseUp);
//             }
//         }, 100);
//     }
//
//     document.addEventListener('mouseup', onMouseUp);
// };
//
// UserMultiSelectMenu.prototype.requestUserAction = function () {
//     var thisC = this;
//     this.elt = this.findNode(this.args.eltPath);
//     this._verifyMultiSelectMenu(this.elt);
//     return new Promise(function (resolve, reject) {
//         function clear() {
//             thisC.emitter.off('finish', onFinish)
//                 .off('cancel', onCancel);
//         }
//
//         var onCancel = function () {
//             clear();
//             reject();
//         }
//         var onFinish = function () {
//             clear();
//             resolve();
//         };
//         thisC.nextActionState('entry')
//     });
//
// };

//
// UserMultiSelectMenu.attachEnv = function (tutor, env) {
//     env.userMultiSelectMenu = function (eltPath, values, message, wrongMessage) {
//         return new UserMultiSelectMenu(tutor, {
//             eltPath: eltPath,
//             values: values,
//             message: message,
//             wrongMessage: wrongMessage
//         }).exec();
//     }
// };

TutorEngine.installClass(UserMultiSelectMenu);

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