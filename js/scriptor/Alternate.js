import BaseCommand from "./BaseCommand";
import OOP from "absol/src/HTML5/OOP";

/***
 * @extends BaseCommand
 * @constructor
 */
function Alternate() {
    BaseCommand.apply(this, arguments);
}

OOP.mixClass(Alternate, BaseCommand);

Alternate.prototype.exec = function () {
    return this.args.statements.reduce(function (ac, st) {
        return ac.then(function () {
            return st.exec();
        })
    }, Promise.resolve);
};

Alternate.attachEnv = function (tutor, env) {
    function visitArr(arr, ac) {
        var item;
        for (var i = 0; i < arr.length; ++i) {
            item = arr[i];
            if (item instanceof Array) {
                visitArr(item, ac);
            }
            else {
                ac.push(item);
            }
        }
    }

    env.ALTERNATE = function () {
        var statements = [];
        visitArr(arguments, statements);
        return new Alternate(tutor, { statements: statements });
    }
};

export default Alternate;
