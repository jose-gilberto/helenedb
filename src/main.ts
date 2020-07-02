// This is a test file, do not leave them to production

import Lexer from './query/processor/lexer/Lexer';
import SymbolTable from './query/processor/symbol-table/SymbolTable';

const program = `
CREATE SCHEMA public AUTHORIZATION user;
`;

const sb = new SymbolTable();
const lexer = new Lexer(sb);
const tokens = lexer.start(program);

console.log(tokens);
