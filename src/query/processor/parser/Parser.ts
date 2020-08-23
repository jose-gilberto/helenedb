import Token from '../lexer/token/Token';
import Lexer from '../lexer/Lexer';
import TokenType from '../lexer/token/TokenType';

class AST {}

class BinaryOperation extends AST {
  public left: any;
  public operator: Token;
  public right: any;

  constructor(left: any, operator: Token, right: any) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}

class NumberExpression extends AST {
  public number: Token;
  public value: number | string;

  constructor(number: Token) {
    super();
    this.number = number;
    this.value = number.getValue();
  }
}

export default class Parser {
  private lexer: Lexer;
  private current: Token;

  constructor(program: string) {
    this.lexer = new Lexer(program);
    this.current = this.lexer.nextToken();
  }

  private error() {
    throw new Error();
  }

  public eat(type: TokenType) {
    if (this.current.getType() === type) this.current = this.lexer.nextToken();
    else this.error();
  }

  public factor() {
    const token = this.current;
    if (token.getType() === TokenType.NUMBER_LITERAL) {
      this.eat(TokenType.NUMBER_LITERAL);
      return new NumberExpression(token);
    } else if (token.getType() === TokenType.LPAR) {
      this.eat(TokenType.LPAR);
      const node = this.expr();
      this.eat(TokenType.RPAR);
      return node;
    }
  }

  public term() {
    let node: any = this.factor();
    while (
      this.current.getType() === TokenType.STAR ||
      this.current.getType() === TokenType.SLASH
    ) {
      const token = this.current;
      if (token.getType() === TokenType.STAR) {
        this.eat(TokenType.STAR);
      } else if (token.getType() === TokenType.SLASH) {
        this.eat(TokenType.SLASH);
      }
      node = new BinaryOperation(node, token, this.factor());
    }
    return node;
  }

  public expr() {
    let node = this.term();
    while (
      this.current.getType() === TokenType.PLUS ||
      this.current.getType() === TokenType.MINUS
    ) {
      const token = this.current;
      if (token.getType() === TokenType.PLUS) {
        this.eat(TokenType.PLUS);
      } else if (token.getType() === TokenType.MINUS) {
        this.eat(TokenType.MINUS);
      }
      node = new BinaryOperation(node, token, this.term());
    }
    return node;
  }

  public parse() {
    return this.expr();
  }
}
