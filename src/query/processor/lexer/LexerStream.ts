import Token from './token/Token';
import Lexer from './Lexer';

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

    if (Lexer.KEYWORDS.includes(token.getType())) {
      //
    }
  }
}
