import ScriptEngine from "../engine/ScriptEngine";
import OOP from "absol/src/HTML5/OOP";

function TutorEngine() {
    ScriptEngine.call(this);
}


OOP.mixClass(TutorEngine, ScriptEngine);

export default new TutorEngine();

