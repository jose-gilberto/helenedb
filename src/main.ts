// This is a test file, do not leave them to production

import Parser from './query/processor/parser/Parser';
import Lexer from './query/processor/lexer/Lexer';
import TokenType from './query/processor/lexer/token/TokenType';

const program = `SELECT table.id FROM table;`;

// const lexer = new Lexer(program);

// while (true) {
//   let tok = lexer.nextToken()
//   console.log(tok)
//   if (tok.getType() === TokenType.EofToken)
//     break
// }

const parser = new Parser(program);
const ast = parser.parse();

console.log(JSON.stringify(ast));

// console.log(parser.visit(ast));
