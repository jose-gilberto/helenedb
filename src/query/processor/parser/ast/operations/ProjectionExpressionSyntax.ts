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
    return NodeType.ProjectionExpression;
  }

  public visit() {
    if (this.operation.kind() === NodeType.TableExpression) {
      const columns = this.fields.map((m) => m.visit());

      const table = this.operation.visit();
      const result: { [key: string]: any }[] = [];

      if (columns.length === 1 && columns[0] === '*') {
        return table.tuples;
      }

      // TODO: checar semantica das colunas

      table.tuples.forEach((tuple) => {
        const t: { [key: string]: any } = {};

        columns.forEach(([table, column]) => {
          t[column] = tuple[column];
        });

        result.push(t);
      });

      return result;
    }
    throw new Error('Unsuported operation');
  }
}
