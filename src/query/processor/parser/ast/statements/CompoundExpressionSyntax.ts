import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

/**
 * Represents a command list or list of statements block.
 * Like a SQL script with multiple commands in same file, e.g.:
 * ```sql
 * SELECT table.id FROM table;
 * SELECT table2.name FROM table2;
 * ```
 */
export default class CompoundExpressionSyntax extends ExpressionSyntax {
  public children: ExpressionSyntax[];

  constructor() {
    super();
    this.children = [];
  }

  public kind(): NodeType {
    return NodeType.CompoundExpressionSyntax;
  }

  public visit() {
    const results: any[] = [];
    this.children.forEach((op) => {
      results.push(op.visit());
    });
    return results[results.length - 1];
  }
}
