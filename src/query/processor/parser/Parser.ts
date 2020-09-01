import Token from '../lexer/token/Token';
import Lexer from '../lexer/Lexer';
import TokenType from '../lexer/token/TokenType';
import IntegerExpressionSyntax from './ast/primary/IntegerExpressionSyntax';
import BinaryExpressionSyntax from './ast/operations/BinaryExpressionSyntax';
import ExpressionSyntax from './ast/ExpressionSyntax';
import UnaryExpressionSyntax from './ast/operations/UnaryExpressionSyntax';

export default class Parser {
  private lexer: Lexer;
  private current: Token;
  private ast: ExpressionSyntax | undefined;

  constructor(program: string) {
    this.lexer = new Lexer(program);
    this.current = this.lexer.nextToken();
  }

  // private parsePrimaryNameOrCallExpression(): ExpressionSyntax {
  //   if (this.current.getType() === TokenType.OpenParenthesisToken) {
  //     this.eat(TokenType.OpenParenthesisToken)
  //     const node = this.expr()
  //     this.eat(TokenType.CloseParenthesisToken)
  //     return node
  //   }
  //   throw new Error();
  // }

  public match(type: TokenType): void {
    if (this.current.getType() === type) this.current = this.lexer.nextToken();
    else
      throw new SyntaxError(
        `Expect a ${type} token, receive a ${this.current.getType()} token.`
      );
  }

  public parseParenthesizedExpression(): ExpressionSyntax {
    this.match(TokenType.OpenParenthesisToken);
    const node = this.parseBinaryExpression();
    this.match(TokenType.CloseParenthesisToken);
    return node;
  }

  public parseIntegerLiteral(): ExpressionSyntax {
    const token = this.current;
    this.match(TokenType.IntegerLiteral);
    return new IntegerExpressionSyntax(token);
  }

  public parsePrimaryExpression(): ExpressionSyntax {
    switch (this.current.getType()) {
      case TokenType.IntegerLiteral:
        return this.parseIntegerLiteral();
      case TokenType.OpenParenthesisToken: {
        return this.parseParenthesizedExpression();
      }
      case TokenType.PlusToken: {
        const token = this.current;
        this.match(TokenType.PlusToken);
        return new UnaryExpressionSyntax(token, this.parsePrimaryExpression());
      }
      case TokenType.MinusToken: {
        const token = this.current;
        this.match(TokenType.MinusToken);
        return new UnaryExpressionSyntax(token, this.parsePrimaryExpression());
      }
      default:
        throw new SyntaxError(
          `Unsuported Syntax: Expect a Primary Expression receive a ${this.current.getType()}`
        );
    }
  }

  public parsePrioritizedBinaryExpression(): ExpressionSyntax {
    let node: any = this.parsePrimaryExpression();
    while (
      this.current.getType() === TokenType.StarToken ||
      this.current.getType() === TokenType.SlashToken
    ) {
      const token = this.current;
      if (token.getType() === TokenType.StarToken) {
        this.match(TokenType.StarToken);
      } else if (token.getType() === TokenType.SlashToken) {
        this.match(TokenType.SlashToken);
      }
      node = new BinaryExpressionSyntax(
        node,
        token,
        this.parsePrimaryExpression()
      );
    }
    return node;
  }

  public parseBinaryExpression(): ExpressionSyntax {
    let node = this.parsePrioritizedBinaryExpression();
    while (
      this.current.getType() === TokenType.PlusToken ||
      this.current.getType() === TokenType.MinusToken
    ) {
      const token = this.current;
      if (token.getType() === TokenType.PlusToken) {
        this.match(TokenType.PlusToken);
      } else if (token.getType() === TokenType.MinusToken) {
        this.match(TokenType.MinusToken);
      }
      node = new BinaryExpressionSyntax(
        node,
        token,
        this.parsePrioritizedBinaryExpression()
      );
    }
    return node;
  }

  public parse() {
    this.ast = this.parseBinaryExpression();
    return this.ast;
  }

  public visit(node: ExpressionSyntax): any {
    return this.ast?.visit();
  }
}
