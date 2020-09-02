import TokenType from './token/TokenType';
import Token from './token/Token';

export default class Lexer {
  private program: string;
  private position: number;

  private reservedKeywords: { [key: string]: Token } = {
    SELECT: new Token(TokenType.SelectKeyword, 'SELECT', 0, 0),
    FROM: new Token(TokenType.FromKeyword, 'FROM', 0, 0),
  };

  // Flow Control Variables
  // Line pointer
  //private lineCounter: number;
  // Column pointer
  //private colCounter: number;

  constructor(program: string) {
    this.program = program;
    this.position = 0;
  }

  /**
   * @description Returns the current character marked with the pointer.
   * @returns The current char.
   */
  private current(): string {
    if (this.position >= this.program.length) return '\0';
    return this.program[this.position];
  }

  private next(): void {
    this.position++;
  }

  private peek(offset: number) {
    const pos = this.position + offset;
    if (pos > this.program.length - 1) return '/0';
    else return this.program[pos];
  }

  private identifier(): Token {
    let result = '';
    while (this.current() != '\0' && this.current().match(/[a-zA-Z]/)) {
      result += this.current();
      this.position++;
    }
    const token: Token =
      this.reservedKeywords[result] === undefined
        ? new Token(TokenType.IdentifierToken, result, 0, 0)
        : this.reservedKeywords[result];
    return token;
  }

  public nextToken(): Token {
    if (this.position >= this.program.length) {
      return new Token(TokenType.EofToken, '\0', 0, 0);
    }

    if (this.current().match(/[a-zA-Z]/)) {
      return this.identifier();
    }

    if (this.current().match(/[0-9]/)) {
      const start = this.position;

      while (this.current().match(/[0-9]/)) this.next();

      const length = this.position - start;
      const lexem = this.program.substring(start, start + length);
      const value = parseInt(lexem);
      // TODO: add columns and rows support
      return new Token(TokenType.IntegerLiteral, value, 0, 0);
    }

    if (this.current().match(/\s/)) {
      const start = this.position;

      while (this.current().match(/\s/)) this.next();

      const length = this.position - start;
      const lexem = this.program.substring(start, start + length);

      // TODO: add columns and rows support
      return new Token(TokenType.WhitespaceToken, lexem, 0, 0);
    }

    if (this.current() === '+') {
      // TODO: add columns and rows support
      this.next();
      return new Token(TokenType.PlusToken, '+', 0, 0);
    }

    if (this.current() === '-') {
      // TODO: add columns and rows support
      this.next();
      return new Token(TokenType.MinusToken, '-', 0, 0);
    }

    if (this.current() === '/') {
      // TODO: add columns and rows support
      this.next();
      return new Token(TokenType.SlashToken, '/', 0, 0);
    }

    if (this.current() === '*') {
      // TODO: add columns and rows support
      this.next();
      return new Token(TokenType.StarToken, '*', 0, 0);
    }

    if (this.current() === '(') {
      // TODO: add columns and rows support
      this.next();
      return new Token(TokenType.OpenParenthesisToken, '(', 0, 0);
    }

    if (this.current() === ')') {
      // TODO: add columns and rows support
      this.next();
      return new Token(TokenType.CloseParenthesisToken, ')', 0, 0);
    }

    this.position++;
    return new Token(TokenType.BadToken, this.program[this.position - 1], 0, 0);
  }
}
