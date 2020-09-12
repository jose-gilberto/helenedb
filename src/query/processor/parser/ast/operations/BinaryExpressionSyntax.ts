import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';
import Token from '../../../lexer/token/Token';
import TokenType from '../../../lexer/token/TokenType';

export default class BinaryExpressionSyntax extends ExpressionSyntax {
  public left: ExpressionSyntax;
  public right: ExpressionSyntax;
  public operator: Token;

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

  public kind(): NodeType {
    return NodeType.BinaryExpressionSyntax;
  }

  public visit(): number {
    switch (this.operator.getType()) {
      case TokenType.PlusToken:
        return this.left.visit() + this.right.visit();
      case TokenType.MinusToken:
        return this.left.visit() - this.right.visit();
      case TokenType.StarToken:
        return this.left.visit() * this.right.visit();
      case TokenType.SlashToken:
        return this.left.visit() / this.right.visit();
      default:
        throw new Error(
          `Unsuported binary operation: ${this.operator.getType()}`
        );
    }
  }
}
