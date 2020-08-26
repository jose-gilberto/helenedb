import Token from '../lexer/token/Token';
import Lexer from '../lexer/Lexer';
import TokenType from '../lexer/token/TokenType';

abstract class SyntaxNode {
  public abstract kind(): TokenType;
}

abstract class ExpressionSyntax extends SyntaxNode {}

class BinaryExpression extends ExpressionSyntax {
  public left: any;
  public operator: Token;
  public right: any;

  constructor(
    left: ExpressionSyntax,
    operator: Token,
    right: ExpressionSyntax
  ) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  public kind() {
    return TokenType.BinaryExpression;
  }
}

class NumberExpression extends ExpressionSyntax {
  public number: Token;
  public value: number | string;

  constructor(number: Token) {
    super();
    this.number = number;
    this.value = number.getValue();
  }

  public kind(): TokenType {
    return TokenType.NumberExpression;
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
    if (token.getType() === TokenType.IntegerLiteral) {
      this.eat(TokenType.IntegerLiteral);
      return new NumberExpression(token);
    } else if (token.getType() === TokenType.OpenParenthesisToken) {
      this.eat(TokenType.OpenParenthesisToken);
      const node = this.expr();
      this.eat(TokenType.CloseParenthesisToken);
      return node;
    }
  }

  public term() {
    let node: any = this.factor();
    while (
      this.current.getType() === TokenType.StarToken ||
      this.current.getType() === TokenType.SlashToken
    ) {
      const token = this.current;
      if (token.getType() === TokenType.StarToken) {
        this.eat(TokenType.StarToken);
      } else if (token.getType() === TokenType.SlashToken) {
        this.eat(TokenType.SlashToken);
      }
      node = new BinaryExpression(node, token, this.factor());
    }
    return node;
  }

  public expr() {
    let node = this.term();
    while (
      this.current.getType() === TokenType.PlusToken ||
      this.current.getType() === TokenType.MinusToken
    ) {
      const token = this.current;
      if (token.getType() === TokenType.PlusToken) {
        this.eat(TokenType.PlusToken);
      } else if (token.getType() === TokenType.MinusToken) {
        this.eat(TokenType.MinusToken);
      }
      node = new BinaryExpression(node, token, this.term());
    }
    return node;
  }

  public parse() {
    return this.expr();
  }
}
