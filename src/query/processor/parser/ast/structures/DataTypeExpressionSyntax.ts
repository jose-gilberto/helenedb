import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

export default class DataTypeExpressionSyntax extends ExpressionSyntax {
  public type: string;
  public size: number;

  constructor(type: string, size: number) {
    super();
    this.type = type;
    this.size = size;
  }

  public kind(): NodeType {
    return NodeType.DataTypeExpressionSyntax;
  }
  public visit() {
    return {
      type: this.type,
      size: this.size,
    };
  }
}
