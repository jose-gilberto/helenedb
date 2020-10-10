import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

export default class CreateColumnExpressionSyntax extends ExpressionSyntax {
  public column: ExpressionSyntax; // IDENTIFIER
  public dataType: ExpressionSyntax; // TYPE

  constructor(column: ExpressionSyntax, dataType: ExpressionSyntax) {
    super();
    this.column = column;
    this.dataType = dataType;
  }

  public kind(): NodeType {
    return NodeType.CreateColumnExpressionSyntax;
  }
  public visit() {
    return {
      column: this.column.visit(),
      ...this.dataType.visit(),
    };
  }
}
