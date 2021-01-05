import PuncturedModal from "./PuncturedModal";
import BlinkMask from "./BlinkMask";

export var PublicTutorCreators = [
    PuncturedModal,
    BlinkMask
]
export default function install(core) {
    core.install(PublicTutorCreators);
}