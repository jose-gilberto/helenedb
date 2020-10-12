import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';
import fs from 'fs';
import path from 'path';
import FileManager from '../../../../../data/file/FileManager';

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
    const table = this.table.visit();
    const data = fs
      .readFileSync(path.resolve(FileManager.FILES_DIR, `${table}.json`))
      .toString();

    return JSON.parse(data);
  }
}
