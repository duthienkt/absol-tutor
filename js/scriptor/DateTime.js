import TutorNameManager from "./TutorNameManager";
import {formartDateString, parseDateString} from 'absol/src/Time/datetime';

var DateTime = {};

DateTime.properties = {};

DateTime.properties.parseDMY = function (str) {
    return parseDateString(str, 'dd/mm/yyyy');
};

DateTime.properties.formatDateString = formartDateString;

DateTime.libs = {};
Object.keys(DateTime.properties).forEach(function (key) {
    Object.defineProperty(DateTime.libs, key, {
        value: DateTime.properties[key],
        configurable: false,
        writable: false
    });
});

DateTime.attachEnv = function (tutor, env) {
    env.datetime = DateTime.libs;
};

TutorNameManager.addConst('datetime');

export default DateTime;