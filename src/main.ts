// This is a test file, do not leave them to production

import Parser from './query/processor/parser/Parser';

const program = `1+2*(3+2)`;

const parser = new Parser(program);
const ast = parser.parse();

console.log(ast);

console.log(parser.visit(ast));
