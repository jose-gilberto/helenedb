import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

export default class ColumnExpressionSyntax extends ExpressionSyntax {
  public table: ExpressionSyntax;
  public column: ExpressionSyntax;

  constructor(column: ExpressionSyntax, table: ExpressionSyntax) {
    super();
    this.column = column;
    this.table = table;
  }

  public kind(): NodeType {
    return NodeType.ColumnExpression;
  }
  public visit() {
    throw new Error('Method not implemented.');
  }
}
