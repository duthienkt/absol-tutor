import Tutor from './Tutor';
import runScriptFromUrl from "./runScriptFromUrl";
import SplitEditor from "./app/SplitEditor";
import TutorMaster from "./app/TutorMaster";
import FlagManager from "./app/FlagManager";
import findNode from "./util/findNode";
import UserBaseAction from "./scriptor/UserBaseAction";
import BaseCommand from "./scriptor/BaseCommand";
import TACData from "./scriptor/TACData";
import TutorNameManager from "./scriptor/TutorNameManager";
import expressionList from "./scriptor/expressionList";
import Core from "./dom/Core";
import install from "./dom/install";

export default {
    FlagManager: FlagManager,
    Tutor: Tutor,
    runScriptFromUrl: runScriptFromUrl,
    SplitEditor: SplitEditor,
    TutorMaster: TutorMaster,
    findNode: findNode,
    UserBaseAction: UserBaseAction,
    BaseCommand: BaseCommand,
    TACData: TACData,
    TutorNameManager: TutorNameManager,
    expressionList: expressionList,
    Core: Core,
    installToCore: install
}



