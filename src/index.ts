#!/usr/bin/env node

import inputs from "./input/inputs";
import prettier from "./prettier/prettier";
import split from "./split/split";
import lebab from "./prettier/lebab";
import * as jscodeshift from "./prettier/jscodeshift";
import * as fs from "fs";

async function main() {
  const code = split(prettier(await inputs.remote()));

  code.majsoul.before = code.majsoul.split.map(s => jscodeshift.before(s));
  code.majsoul.lebab = code.majsoul.before.map(s => lebab(s));
  code.majsoul.after = code.majsoul.lebab.map(s => jscodeshift.after(s));

  code.majsoul.after.forEach((code, index) => {
    fs.writeFileSync(`result/${index}.js`, code, { encoding: "utf-8" });
  });
}

main();
