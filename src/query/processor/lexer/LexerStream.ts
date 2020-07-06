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
      throw new Error('Bad Syntax');
    }

    this.p++;
  }

  public consumeNumber(): number {
    if (this.p > this.tokens.length) {
      throw new Error('Bad Syntax');
    }

    const token = this.tokens[this.p];

    if (token.getType() !== TokenType.INTEGER) {
      throw new Error('Bad Syntax');
    }

    this.p++;
    return Number(token.getValue());
  }

  public consumeIdentifier(): [string, number] {
    if (this.p > this.tokens.length) {
      throw new Error('Bad Syntax');
    }

    const token = this.tokens[this.p];

    if (token.getType() !== TokenType.IDENTIFIER) {
      throw new Error('Bad Syntax');
    }

    this.p++;
    // 0-identifier
    // [pos]-[address]
    const [pos, addr] = token.getValue().toString().split('-');
    return [addr, Number(pos)];
  }

  public consumeSymbol(s: string): void {
    if (this.p > this.tokens.length) {
      throw new Error('Bad Syntax');
    }

    const token = this.tokens[this.p];

    if (token.getType() !== s) {
      throw new Error('Bad Syntax');
    }

    this.p++;
  }

  public consumeText(): string {
    if (this.p > this.tokens.length) {
      throw new Error('Bad Syntax');
    }

    const token = this.tokens[this.p];

    // if (token.getType() !== TokenType.TEXT) {
    // throe new Error('Bad Syntax')
    // }

    this.p++;
    return token.getValue().toString();
  }

  // public consumeDate() {}
}
