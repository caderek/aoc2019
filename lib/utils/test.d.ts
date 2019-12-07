declare type Test = {
    <T>(result: T, expected: T): boolean;
    <T>(result: T): (expected: T) => boolean;
};
export declare const test: Test;
export {};
