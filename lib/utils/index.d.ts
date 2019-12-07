import { test } from "./test";
import { readInput } from "./readInput";
export { test, readInput };
declare const _default: {
    test: {
        <T>(result: T, expected: T): boolean;
        <T_1>(result: T_1): (expected: T_1) => boolean;
    };
    readInput: () => string;
};
export default _default;
