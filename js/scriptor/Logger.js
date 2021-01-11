import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";

var Logger = {};

Logger.properties = {};
Logger.properties.log = console.log.bind(console);

Logger.attachEnv = function (tutor, env) {
    Object.assign(env, Logger.properties);
};

TutorNameManager.addAsync('downloadText');

TACData.define('log', {
    type: 'function',
    args: [
        { name: '...arg', type: 'any' }
    ],
    returns: 'void',
    desc: "in ra console để debug"
});


export default Logger;