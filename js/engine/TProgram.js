/***
 *
 * @param {ScriptEngine} engine
 * @param {function} exec
 * @param {string[]} envArgNames
 * @param {{}}info
 * @constructor
 */
import TProcess from "./TProcess";

function TProgram(engine, exec, envArgNames, info) {
    Object.assign(this, info);
    this.engine = engine;
    this.exec = exec;
    this.envArgNames = envArgNames;
}

TProgram.prototype.ProcessClass = TProcess;

/***
 *
 * @returns {TProcess}
 */
TProgram.prototype.newProcess = function (){
    return new this.ProcessClass(this);
};

export default TProgram;
