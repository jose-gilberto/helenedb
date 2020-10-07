// This is a test file, do not leave them to production
import Lexer from './query/processor/lexer/Lexer';
import TokenType from './query/processor/lexer/token/TokenType';

const program = `
  CREATE TABLE tabelaA (
    id INTEGER,
    name VARCHAR(128)
  );
`;

const lexer = new Lexer(program);

// eslint-disable-next-line no-constant-condition
while (true) {
  const token = lexer.nextToken();
  console.log(token);
  if (token.getType() === TokenType.EofToken) {
    break;
  }
}
