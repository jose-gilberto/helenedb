import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

export default class SelectionExpressionSyntax extends ExpressionSyntax {
  public predicate: ExpressionSyntax;
  public operation: ExpressionSyntax;

  constructor(predicate: ExpressionSyntax, operation: ExpressionSyntax) {
    super();
    this.predicate = predicate;
    this.operation = operation;
  }

  public kind(): NodeType {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public visit(): any {
    throw new Error('Method not implemented.');
  }
}
