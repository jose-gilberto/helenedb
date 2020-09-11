import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

export default class NoOperationExpressionSyntax extends ExpressionSyntax {
  public kind(): NodeType {
    return NodeType.NoOperationExpression;
  }
  public visit() {
    return;
  }
}
