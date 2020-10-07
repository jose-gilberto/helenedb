import TokenType from './token/TokenType';
import Token from './token/Token';

export default class Lexer {
  private program: string;
  private position: number;

  private reservedKeywords: { [key: string]: Token } = {
    SELECT: new Token(TokenType.SelectKeyword, 'SELECT'),
    FROM: new Token(TokenType.FromKeyword, 'FROM'),
    CREATE: new Token(TokenType.CreateKeyword, 'CREATE'),
    TABLE: new Token(TokenType.TableKeyword, 'TABLE'),
    VARCHAR: new Token(TokenType.TextToken, 'VARCHAR'),
    INTEGER: new Token(TokenType.IntegerToken, 'INTEGER'),
  };

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

    while (this.current() !== '\0' && this.current().match(/[a-zA-Z]/)) {
      result += this.current();
      this.position++;
    }

    const token: Token =
      this.reservedKeywords[result] === undefined
        ? new Token(TokenType.IdentifierToken, result)
        : this.reservedKeywords[result];

    return token;
  }

  private skipWhitespace(): void {
    while (this.current() !== '\0' && this.current().match(/[\b\n\t ]/))
      this.position++;
  }

  public nextToken(): Token {
    if (this.current().match(/[\b\n\t ]/)) {
      this.skipWhitespace();
    }

    if (this.position >= this.program.length) {
      return new Token(TokenType.EofToken, '\0');
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
      return new Token(TokenType.IntegerLiteral, value);
    }

    if (this.current() === '*') {
      this.next();
      return new Token(TokenType.StarToken, '*');
    }

    if (this.current() === '(') {
      this.next();
      return new Token(TokenType.OpenParenthesisToken, '(');
    }

    if (this.current() === ')') {
      this.next();
      return new Token(TokenType.CloseParenthesisToken, ')');
    }

    if (this.current() === ';') {
      this.next();
      return new Token(TokenType.SemicolonToken, ';');
    }

    if (this.current() === ',') {
      this.next();
      return new Token(TokenType.CommaToken, ',');
    }

    this.position++;
    return new Token(TokenType.BadToken, this.program[this.position - 1]);
  }
}
