/***
 *
 * @param {TProgram} program
 * @constructor
 */
function TProcess(program) {
    this.program = program;
    this.env = {};
    this.program.engine.makeEnvVariables(this);
    this.state = 'READY';
    this.returns = null;
    this.stack = [];

    this.debug = {
        loc: {
            start: -1,
            end: -1,
            row: 0, //indexing from 1
            col: 0,
        }
    };
}

TProcess.prototype.exec = function () {
    if (this.state !== "READY") return this.returns;
    this.state = 'RUNNING';
    var args = this.program.envArgNames.map(function (nane) {
        return this.env[nane];
    }.bind(this));

    this.returns = this.program.exec.apply(this, args);
    return this.returns;

};

TProcess.prototype.stop = function () {
    if (this.state !== 'RUNNING') return;
    this.state = 'STOP';
    var stack = this.stack.slice();
    while (stack.length > 0) {
        stack.pop().reject();
    }
}


export default TProcess;