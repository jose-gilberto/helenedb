import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';
import Token from '../../../lexer/token/Token';

export default class IdentifierExpressionSyntax extends ExpressionSyntax {
  public token: Token;
  public value: string | number;

  constructor(token: Token) {
    super();
    this.token = token;
    this.value = token.getValue();
  }

  public kind(): NodeType {
    return NodeType.IdentifierExpression;
  }
  public visit(): string {
    return this.value.toString();
  }
}
