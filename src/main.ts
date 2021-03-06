import FileManager from './data/file/FileManager';
// This is a test file, do not leave them to production
import Lexer from './query/processor/lexer/Lexer';
import TokenType from './query/processor/lexer/token/TokenType';
import Parser from './query/processor/parser/Parser';

const program = `
  INSERT INTO tasks VALUES (2);
`;

const fm = new FileManager();
const lexer = new Lexer(program);

// eslint-disable-next-line no-constant-condition
while (true) {
  const token = lexer.nextToken();
  console.log(token);
  if (token.getType() === TokenType.EofToken) {
    break;
  }
}

console.log('\n----------\n');

const parser = new Parser(program);
console.log(parser.parse());

console.log('\n----------\n');

console.log(JSON.stringify(parser.visit()));
