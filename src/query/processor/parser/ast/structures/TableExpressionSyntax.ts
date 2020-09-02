import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

export default class TableExpressionSyntax extends ExpressionSyntax {
  public table: ExpressionSyntax;

  constructor(table: ExpressionSyntax) {
    super();
    this.table = table;
  }

  public kind(): NodeType {
    return NodeType.TableExpression;
  }

  public visit() {
    throw new Error('Method not implemented.');
  }
}
