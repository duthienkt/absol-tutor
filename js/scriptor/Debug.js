import TutorNameManager from "./TutorNameManager";

var Debug = {};

Debug.properties = {};

Debug.attachEnv = function (tutor, env) {
    env._db = function (row, col, start, end) {
        tutor.debug.loc.row = row;
        tutor.debug.loc.col = col;
        tutor.debug.loc.start = start;
        tutor.debug.loc.end = end;
    };
};

TutorNameManager.addAsync('_db');

export default Debug;