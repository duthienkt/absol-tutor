function TDebug(process, args){
    this.process= process;
    this.args = args;
}

TDebug.prototype.argNames = ['row', 'col', 'start', 'end'];

TDebug.prototype.name = '_db';
TDebug.prototype.type = 'sync';
TDebug.prototype.className = 'TDebug';

TDebug.prototype.exec = function (){
    Object.assign(this.process.debug.loc, this.args);
};


export default TDebug;