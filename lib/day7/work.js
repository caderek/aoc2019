"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_1 = require("@arrows/worker");
const computer2_1 = require("./computer2");
const handler = ({ source, initialInput, inputs, outputs, name }) => {
    computer2_1.default(source, initialInput, inputs, outputs, name);
    return { result: outputs[0], name };
};
exports.default = worker_1.worker(handler);
