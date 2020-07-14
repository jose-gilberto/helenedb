// This is a test file, do not leave them to production

import Lexer from './query/processor/lexer/Lexer';
import SymbolTable from './query/processor/symbol-table/SymbolTable';
import TokenType from './query/processor/lexer/token/TokenType';
import Parser from './query/processor/parser/Parser';

const program = `
SELECT user.id, user.name FROM user WHERE user.id = 1 AND user.name LIKE 'Jose%';
`;

const sb = new SymbolTable();
const lexer = new Lexer();
const tokens = lexer.start(program);

console.log(tokens);

const parser = new Parser(tokens, sb);
console.log(sb);
