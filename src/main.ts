// This is a test file, do not leave them to production

import Parser from './query/processor/parser/Parser';
import Lexer from './query/processor/lexer/Lexer';
import TokenType from './query/processor/lexer/token/TokenType';
import FileManager from './data/file/FileManager';

// const program = `SELECT tablea.name, tablea.id FROM tablea;`;

// const parser = new Parser(program);
// const ast = parser.parse();

new FileManager('');
// console.log(JSON.stringify(ast));

// console.table(parser.visit(ast));
