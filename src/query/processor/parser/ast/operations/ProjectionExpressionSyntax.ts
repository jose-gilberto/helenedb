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

  public visit(): any {
    if (this.operation.kind() === NodeType.TableExpression) {
      const columns = this.fields.map((m) => m.visit());

      const table = this.operation.visit();
      const tableColumns = table.metadata.columns.map((c) => c.column);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: { [key: string]: any }[] = [];

      if (columns.length === 1 && columns[0] === '*') {
        return table;
      }

      console.log(tableColumns);

      columns.forEach((col) => {
        // col = [table][column]
        // col[1] = column that will be projected
        if (!tableColumns.includes(col[1])) {
          throw new Error(`Column not exist in table: ${table.metadata.name}`);
        }
      });
      // TODO: maybe change for a map funtion
      table.tuples.forEach((tuple) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const t: { [key: string]: any } = {};

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        columns.forEach(([_, column]) => {
          t[column] = tuple[column];
        });

        result.push(t);
      });

      //TODO: Update the metadata avaliable
      table.tuples = result;

      return table;
    }
    throw new Error('Unsuported operation');
  }
}
