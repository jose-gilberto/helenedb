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
    if (this.operation.kind() === NodeType.TableExpression) {
      const table = this.operation.visit();
      const columns = [];
      const result: { [key: string]: any[] } = {};

      this.fields.forEach((c) => {
        const arr = c.visit();
        if (arr[0] !== table['tableName']) {
          throw Error();
        } else {
          if (table[arr[1]] === undefined) {
            throw Error();
          } else {
            result[arr[1]] = table[arr[1]];
          }
        }
      });

      return result;
    }
  }
}
