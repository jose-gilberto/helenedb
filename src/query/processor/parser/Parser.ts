import Token from '../lexer/token/Token';
import Lexer from '../lexer/Lexer';
import TokenType from '../lexer/token/TokenType';
import IntegerExpressionSyntax from './ast/primary/IntegerExpressionSyntax';
import BinaryExpressionSyntax from './ast/operations/BinaryExpressionSyntax';
import ExpressionSyntax from './ast/ExpressionSyntax';

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

  private error(): void {
    throw new Error();
  }

  public eat(type: TokenType): void {
    if (this.current.getType() === type) this.current = this.lexer.nextToken();
    else this.error;
  }

  public parsePrimaryExpression(): ExpressionSyntax {
    const token = this.current;
    switch (token.getType()) {
      case TokenType.IntegerLiteral:
        this.eat(TokenType.IntegerLiteral);
        return new IntegerExpressionSyntax(token);
      case TokenType.OpenParenthesisToken: {
        this.eat(TokenType.OpenParenthesisToken);
        const node = this.expr();
        this.eat(TokenType.CloseParenthesisToken);
        return node;
      }
      default:
        throw new Error();
    }
  }

  public term(): ExpressionSyntax {
    let node: any = this.parsePrimaryExpression();
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
      node = new BinaryExpressionSyntax(
        node,
        token,
        this.parsePrimaryExpression()
      );
    }
    return node;
  }

  public expr(): ExpressionSyntax {
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
      node = new BinaryExpressionSyntax(node, token, this.term());
    }
    return node;
  }

  public parse() {
    this.ast = this.expr();
    return this.ast;
  }

  public visit(node: ExpressionSyntax): any {
    return this.ast?.visit();
  }
}
