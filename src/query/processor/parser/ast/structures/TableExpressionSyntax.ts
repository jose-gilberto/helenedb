import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

const tables: { [keY: string]: Record<string, any> } = {
  tablea: {
    tableName: 'tablea',
    id: [1, 2, 3, 4],
    name: ['john', 'bob', 'brédi', 'meri meri'],
  },
};

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
    const tableName = this.table.visit();
    return tables[tableName];
  }
}
