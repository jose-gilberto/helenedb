import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

export default class TableExpressionSyntax extends ExpressionSyntax {
  public table: ExpressionSyntax;
  public operation?: ExpressionSyntax;

  constructor(table: ExpressionSyntax, operation?: ExpressionSyntax) {
    super();
    this.table = table;
    this.operation = operation;
  }

  public kind(): NodeType {
    return NodeType.TableExpression;
  }

  public visit() {
    throw new Error('Method not implemented.');
  }
}
