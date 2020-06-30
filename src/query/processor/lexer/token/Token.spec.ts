import Token from './Token';
import TokenType from './TokenType';

describe('Token class', () => {
  test('Shoud return a string', () => {
    const stu = new Token(TokenType.IDENTIFIER, 'str_value');
    expect(typeof stu.getValue()).toBe('string');
  });

  test('Shoud return a number', () => {
    const stu = new Token(TokenType.IDENTIFIER, 1);
    expect(typeof stu.getValue()).toBe('number');
  });

  test('Shoud return a token type', () => {
    const stu = new Token(TokenType.IDENTIFIER, 'str_value');
    expect(stu.getType() in TokenType).toBe(true);
  });
});
