import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

export default class ProjectionExpressionSyntax extends ExpressionSyntax {
  public fields: ExpressionSyntax[];
  public operation: ExpressionSyntax;

  constructor(fields: ExpressionSyntax[], operation: ExpressionSyntax) {
    super();
    this.fields = fields;
    this.operation = operation;
  }

  public kind(): NodeType {
    throw new Error('Method not implemented.');
  }
  public visit() {
    throw new Error('Method not implemented.');
  }
}
