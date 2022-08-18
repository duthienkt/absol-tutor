import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";
import TutorEngine from "./TutorEngine";

var Utils = {};

Utils.properties = {};
Utils.properties.EQUAL_NUMBER = function (number, delta) {
    delta = delta || 0;
    return function (value) {
        if (typeof value === "string") {
            value = parseFloat(value);
        }
        if (Math.abs(number - value) <= delta) return true;
        return false;
    }
};

TutorEngine.installFunction('EQUAL_NUMBER', Utils.properties.EQUAL_NUMBER, false);

TutorNameManager.addAsync('EQUAL_NUMBER');

TACData.define('EQUAL_NUMBER', {
    type: 'function',
    args: [
        { name: 'value', type: 'string|number' }
    ],
    returns: 'function',
    desc: "So sánh số"
});


export default Utils;