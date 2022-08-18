import OOP from "absol/src/HTML5/OOP";
import FunctionNameManager from "./TutorNameManager";
import TACData from "./TACData";
import UserBaseAction from "./UserBaseAction";

/***
 * @extends UserBaseAction
 * @constructor
 */
function UserFileListInput() {
    UserBaseAction.apply(this, arguments);
}

OOP.mixClass(UserFileListInput, UserBaseAction);

UserFileListInput.prototype._verifyInput = function (elt) {
    if (!elt.containsClass || !elt.containsClass('as-file-list-input')) {
        throw new Error('Type error: not a FileInputBox');
    } else if (elt.readOnly) {
        throw new Error('Element error: element is not allow upload(allowUpload=false)');
    }
};

UserFileListInput.prototype._blinkInput = function () {
    var self = this;
    return new Promise(function (resolve, reject){
       var timeout = setTimeout(function (){
           resolve();
       }, 500);
        self._rejectCb = function (){
            clearTimeout();
        };
    });
};


UserFileListInput.prototype._waitFile = function () {
    // var self = this;
    // var elt = this.elt;
    // return new Promise(function (resolve, reject) {
    //     self.highlightElt(elt);
    //     self.onlyClickTo(elt);
    //     var timeout = -1;
    //
    //     function onClick() {
    //         self.highlightElt(null);
    //         self.onlyClickTo(null);
    //         timeout = setTimeout(waitFocus, 500);
    //     }
    //
    //     elt.once('click', onClick);
    //
    //     function waitFocus() {
    //         if (document.hasFocus()) {
    //             if (self.elt.value) {
    //                 resolve(true);
    //             } else {
    //                 resolve(false);
    //             }
    //         } else {
    //             timeout = setTimeout(waitFocus, 500);
    //         }
    //     }
    //
    //     self._rejectCb = function () {
    //         elt.off('click', onClick);
    //         reject();
    //     }
    // }).then(function (ok) {
    //     if (!ok) return self._waitFile();
    //     return true;
    // });
}

UserFileListInput.prototype.requestUserAction = function () {
    this.elt = this.tutor.findNode(this.args.eltPath);
    this.assignTarget(this.elt);
    this._verifyInput(this.elt);
    return this._waitFile();
};


UserFileListInput.attachEnv = function (tutor, env) {
    env.userFileListInput = function (eltPath, fileCount, message, wrongMessage) {
        return new UserFileListInput(tutor, {
            eltPath: eltPath,
            fileCount: fileCount,
            message: message,
            wrongMessage: wrongMessage
        }).exec();
    };
};

FunctionNameManager.addAsync('userFileListInput');


TACData.define('userFileListInput', {
    type: 'function',
    args: [
        {name: 'eltPath', type: '(string|AElement)'},
        {name: 'fileCount', type: 'number'},
        {name: 'message', type: 'string'},
        {name: 'wrongMessage', type: 'string'}
    ]
});

export default UserFileListInput;