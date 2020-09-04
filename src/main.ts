// This is a test file, do not leave them to production

import Parser from './query/processor/parser/Parser';
import Lexer from './query/processor/lexer/Lexer';
import TokenType from './query/processor/lexer/token/TokenType';

const program = `SELECT tablea.name, tablea.id FROM tablea;`;

const parser = new Parser(program);
const ast = parser.parse();

// console.log(JSON.stringify(ast));

console.table(parser.visit(ast));
