import TutorNameManager from "./TutorNameManager";
import TACData from "./TACData";
import TutorEngine from "./TutorEngine";

var Logger = {};

Logger.properties = {};
Logger.properties.log = console.log.bind(console);

TutorEngine.installFunction('log', Logger.properties.log, false);

TutorNameManager.addAsync('log');

TACData.define('log', {
    type: 'function',
    args: [
        { name: '...arg', type: 'any' }
    ],
    returns: 'void',
    desc: "in ra console để debug"
});


export default Logger;