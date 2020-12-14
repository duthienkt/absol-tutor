import Explain from './Explain';
import Timeout from './Timeout';
import PressAnyKey from './PressAnyKey';
import ClickAnyWhere from './ClickAnyWhere';
import Or from './Or';
import And from './And';
import Earliest from './Earliest';
import Latest from './Latest';
import ShowSnackBar from './ShowSnackBar';
import Appear from "./Appear";
import Alternate from "./Alternate";
import Declare from "./Declare";
import Var from "./Var";
import Assign from "./Assign";
import QuerySelector from "./QuerySelector";
import UserClick from "./UserClick";
import CurrentInputText from "./CurrentInputText";
import UserCheckbox from "./UserCheckbox";
import UserInputText from "./UserInputText";
import SetRootView from "./SetRootView";
import UserSelectMenu from "./UserSelectMenu";
import ShowToastMessage from "./ShowToastMessage";

var commandList = [
    SetRootView,
    Declare,
    Var,
    Assign,
    Explain,
    Timeout,
    PressAnyKey,
    ClickAnyWhere,
    Or,
    And,
    Earliest,
    Latest,
    ShowSnackBar,
    Appear,
    Alternate,
    QuerySelector,
    UserClick,
    UserCheckbox,
    CurrentInputText,
    UserInputText,
    UserSelectMenu,
    ShowToastMessage
];


export default commandList;

