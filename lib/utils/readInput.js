"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const getCallerFile = require("get-caller-file");
exports.readInput = () => {
    const file = getCallerFile()
        .split("/")
        .slice(0, -1)
        .concat("input.txt")
        .join("/");
    return fs_1.readFileSync(file).toString();
};
