// This is a test file, do not leave them to production

import Lexer from './query/processor/lexer/Lexer';
import SymbolTable from './query/processor/symbol-table/SymbolTable';
import TokenType from './query/processor/lexer/token/TokenType';
import FileManager from './data/file/FileManager';

const program = `
CREATE SCHEMA public AUTHORIZATION user; 22.6 33 ( 22.3 ) + 3 - 4 *
`;

const sb = new SymbolTable();
const lexer = new Lexer(sb);
const tokens = lexer.start(program);

console.log(tokens);

new FileManager('');
