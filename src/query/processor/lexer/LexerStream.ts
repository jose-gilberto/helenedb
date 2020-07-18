import Token from './token/Token';
import Lexer from './Lexer';
import TokenType from './token/TokenType';

export default class LexerStream {
  private tokens: Token[];
  private p: number;

  constructor(t: Token[]) {
    this.tokens = t;
    this.p = 0;
  }

  public getToken(): Token {
    if (this.p > this.tokens.length) {
      throw new Error('Bad Syntax');
    }
    return this.tokens[this.p];
  }

  // public consumeDataType() {

  // }

  public consumeKeyword(kw: string): void {
    if (this.p > this.tokens.length) {
      throw new Error('Bad Syntax');
    }

    const token = this.tokens[this.p];

    if (!Lexer.KEYWORDS.includes(token.getType()) || kw !== token.getType()) {
      throw new Error('Bad Syntax kw');
    }

    this.p++;
  }

  public consumeNumber(): number {
    if (this.p > this.tokens.length) {
      throw new Error('Bad Syntax');
    }

    const token = this.tokens[this.p];

    if (token.getType() !== TokenType.NUMBER_LITERAL) {
      throw new Error(`Bad Syntax: Expect a Number - Got a ${token.getType()}`);
    }

    this.p++;
    return Number(token.getValue());
  }

  public consumeIdentifier(): string {
    if (this.p > this.tokens.length) {
      throw new Error('Bad Syntax');
    }

    const token = this.tokens[this.p];

    if (token.getType() !== TokenType.IDENTIFIER) {
      throw new Error('Bad Syntax identifier');
    }

    this.p++;
    // 0-identifier
    // [pos]-[address]
    return token.getValue().toString();
  }

  public consumeSymbol(s: string): void {
    if (this.p > this.tokens.length) {
      throw new Error('Bad Syntax');
    }

    const token = this.tokens[this.p];

    if (token.getType() !== s) {
      throw new Error('Bad Syntax symbol');
    }

    this.p++;
  }

  public consumeText(): string {
    if (this.p > this.tokens.length) {
      throw new Error('Bad Syntax');
    }

    const token = this.tokens[this.p];

    if (token.getType() !== TokenType.TEXT_LITERAL) {
      throw new Error(
        `Bad Syntax: Expect a String - Got a ${token.getType()} at ${token.getValue()}`
      );
    }

    this.p++;
    return token.getValue().toString();
  }

  public consumeDate(): string {
    if (this.p > this.tokens.length) {
      throw new Error('Bad Syntax');
    }

    const token = this.tokens[this.p];

    if (token.getType() !== TokenType.DATE_LITERAL) {
      throw new Error('Bad Syntax date');
    }

    this.p++;
    return token.getValue().toString();
  }

  public consumeAndOr(): string {
    if (this.p > this.tokens.length) {
      throw new Error('Bad Syntax');
    }

    const token = this.tokens[this.p];

    if (token.getType() === TokenType.AND || token.getType() === TokenType.OR) {
      this.p++;
      return token.getType();
    } else {
      throw new Error('Bad Syntax and/or');
    }
  }

  public consumeRelop(): string {
    if (this.p > this.tokens.length) {
      throw new Error('Bad Syntax');
    }

    const token = this.tokens[this.p];

    if (
      token.getType() === TokenType.EQ ||
      token.getType() === TokenType.GRT ||
      token.getType() === TokenType.GEQ ||
      token.getType() === TokenType.LESS ||
      token.getType() === TokenType.LEQ ||
      token.getType() === TokenType.DIFF ||
      token.getType() === TokenType.LIKE
    ) {
      this.p++;
      return token.getType();
    } else {
      throw new Error('Bad Syntax relop');
    }
  }
}
