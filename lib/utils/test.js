"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const kleur = require("kleur");
const composition_1 = require("@arrows/composition");
let index = 0;
exports.test = composition_1.curry((result, expected) => {
    if (process.env.silent === "true") {
        return;
    }
    const passed = util_1.isDeepStrictEqual(result, expected);
    if (passed) {
        console.log(kleur.green(`${index}: passed`));
    }
    else {
        console.log(kleur.gray("-----------------------------------------"));
        console.log(kleur.red(`${index}: failed`));
        console.log(kleur.gray("\nResult:"));
        console.dir(result, { colors: true, depth: 0 });
        console.log(kleur.gray("\nExpected:"));
        console.dir(expected, { colors: true, depth: 0 });
        console.log(kleur.gray("-----------------------------------------"));
    }
    index++;
});
