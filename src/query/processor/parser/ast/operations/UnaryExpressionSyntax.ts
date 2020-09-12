import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';
import Token from '../../../lexer/token/Token';
import TokenType from '../../../lexer/token/TokenType';

export default class UnaryExpressionSyntax extends ExpressionSyntax {
  public token: Token;
  public expr: ExpressionSyntax;
  public operator: Token;

  constructor(operator: Token, expression: ExpressionSyntax) {
    super();
    this.token = this.operator = operator;
    this.expr = expression;
  }

  public kind(): NodeType {
    return NodeType.UnaryExpressionSyntax;
  }

  public visit(): number {
    const op = this.operator.getType();
    switch (op) {
      case TokenType.PlusToken:
        return +this.expr.visit();
      case TokenType.MinusToken:
        return -this.expr.visit();
      default:
        throw new Error();
    }
  }
}
