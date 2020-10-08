import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

export default class SelectExpressionSyntax extends ExpressionSyntax {
  public table: ExpressionSyntax;

  constructor(table: ExpressionSyntax) {
    super();
    this.table = table;
  }

  public kind(): NodeType {
    return NodeType.SelectExpressionSyntax;
  }

  public visit() {
    return this.table.visit();
  }
}
