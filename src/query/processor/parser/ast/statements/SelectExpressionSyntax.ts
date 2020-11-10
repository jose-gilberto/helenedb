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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public visit(): any {
    const { tuples } = this.operation.visit();
    console.table(tuples);
    return `Select executed with success. Exit code: 0. Rows: ${tuples.length}`;
  }
}
