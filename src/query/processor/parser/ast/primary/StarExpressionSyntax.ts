import Token from '../../../lexer/token/Token';
import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

export default class StarExpressionSyntax extends ExpressionSyntax {
  public token: Token;

  constructor(token: Token) {
    super();
    this.token = token;
  }

  public kind(): NodeType {
    return NodeType.StarExpression;
  }

  public visit() {
    return '*';
  }
}
