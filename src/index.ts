#!/usr/bin/env node

import inputs from './input/inputs';
import prettier from './prettier/prettier';
import split from './split/split';
import putout from './prettier/putout';
import lebab from './prettier/lebab';
import jscodeshift from './prettier/jscodeshift';

async function main() {
  const code = split(prettier(await inputs.remote()));

  code.majsoul.jscodeshift = code.majsoul.split.map(s => jscodeshift(s));
  code.majsoul.putout = code.majsoul.jscodeshift.map(s => putout(s));
  code.majsoul.lebab = code.majsoul.putout.map(s => lebab(s));

  console.log(code.majsoul.lebab[0]);
}

main();
