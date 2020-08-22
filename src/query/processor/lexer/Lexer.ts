import TokenType from './token/TokenType';
import Token from './token/Token';

export default class Lexer {
  private program: string;
  private position: number;

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

  public nextToken(): Token {
    // symbols

    if (this.position >= this.program.length) {
      return new Token(TokenType.EOF, '\0', 0, 0);
    }

    if (this.current().match(/[0-9]/)) {
      const start = this.position;

      while (this.current().match(/[0-9]/)) this.next();

      const length = this.position - start;
      const lexem = this.program.substring(start, start + length);
      // const value = parseInt(lexem)

      // TODO: add columns and rows support
      return new Token(TokenType.NUMBER_LITERAL, lexem, 0, 0);
    }

    if (this.current().match(/\s/)) {
      const start = this.position;

      while (this.current().match(/\s/)) this.next();

      const length = this.position - start;
      const lexem = this.program.substring(start, start + length);

      // TODO: add columns and rows support
      return new Token(TokenType.WHITESPACE, lexem, 0, 0);
    }

    if (this.current() === '+') {
      // TODO: add columns and rows support
      this.next();
      return new Token(TokenType.PLUS, '+', 0, 0);
    }

    if (this.current() === '-') {
      // TODO: add columns and rows support
      this.next();
      return new Token(TokenType.MINUS, '-', 0, 0);
    }

    if (this.current() === '/') {
      // TODO: add columns and rows support
      this.next();
      return new Token(TokenType.SLASH, '/', 0, 0);
    }

    if (this.current() === '*') {
      // TODO: add columns and rows support
      this.next();
      return new Token(TokenType.STAR, '*', 0, 0);
    }

    if (this.current() === '(') {
      // TODO: add columns and rows support
      this.next();
      return new Token(TokenType.LPAR, '(', 0, 0);
    }

    if (this.current() === ')') {
      // TODO: add columns and rows support
      this.next();
      return new Token(TokenType.RPAR, ')', 0, 0);
    }

    return new Token(
      TokenType.BAD_TOKEN,
      this.program[this.position - 1],
      0,
      0
    );
  }
}
