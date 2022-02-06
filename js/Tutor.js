import expressionList from './scriptor/expressionList';
import findNode from './util/findNode';
import findAllNodes from "./util/findAllNodes";
import Context from "absol/src/AppPattern/Context";
import OOP from "absol/src/HTML5/OOP";
import EventEmitter from "absol/src/HTML5/EventEmitter";
import { stringHashCode } from "absol/src/String/stringUtils";
import TutorEngine from "./scriptor/TutorEngine";
import safeThrow from "absol/src/Code/safeThrow";


/***
 * @augments Context
 * @param view
 * @param script
 * @param option
 * @constructor
 */
function Tutor(view, script, option) {
    EventEmitter.call(this);
    Context.call(this);
    this.$view = view;
    /***
     *
     * @type {*|TProgram}
     */
    this.prorgram = this.programCache[stringHashCode(script)] || TutorEngine.compile(script);
    /***
     *
     * @type {TProcess}
     */
    this.process = this.prorgram.newProcess();
    this.process.tutor = this;


    this.option = Object.assign({
        messageDelay: 300
    }, option);
    this.debug.status = 'NOT_START';
}

OOP.mixClass(Tutor, EventEmitter, Context);

Tutor.prototype.programCache = {};


Tutor.prototype.exec = function () {
    this.debug.status = "RUNNING";
    return this.process.exec().then(function (result) {
        this.debug.status = "FINISH";
        return result;
    }.bind(this)).catch(function (error) {
        safeThrow(error)
        if (error instanceof Error) {
            this.debug.status = "ERROR";
            throw error;
        }
    }.bind(this));
};

Tutor.prototype.stop = function (){
    this.process.stop();
};


Tutor.prototype.findNode = function (query, unsafe) {
    var elt = findNode(query, this.$view);
    if (!elt && !unsafe) throw new Error('Can not find element with query="' + query + '"');
    return elt;
};

Tutor.prototype.findAllNode = function (query) {
    return findAllNodes(query, this.$view);
};


Tutor.prototype.getStatus = function () {
    if (this.debug.status === "NOT_START") return {
        status: "NOT_START"
    };
    if (this.debug.status === "RUNNING" || this.debug.status === "ERROR")
        return {
            status: this.debug.status,
            code: this.process.program.code.substr(this.debug.loc.start, this.debug.loc.end - this.debug.loc.start),
            row: this.debug.loc.row - 1,
            col: this.debug.loc.col
        };
    return {
        status: "FINISH"
    };
};

Object.defineProperty(Tutor.prototype, 'debug', {
    get: function (){
        return this.process.debug;
    }
})




export default Tutor;
