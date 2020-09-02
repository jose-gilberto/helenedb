import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

export default class SelectExpressionSyntax extends ExpressionSyntax {
  public operation: ExpressionSyntax;

  constructor(operation: ExpressionSyntax) {
    super();
    this.operation = operation;
  }

  public kind(): NodeType {
    return NodeType.SelectExpressionSyntax;
  }

  public visit() {
    throw new Error('Method not implemented.');
  }
}
