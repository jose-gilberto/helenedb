import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';
import fs from 'fs';
import path from 'path';
import FileManager from '../../../../../data/file/FileManager';

export default class SelectExpressionSyntax extends ExpressionSyntax {
  public table: ExpressionSyntax;

  constructor(table: ExpressionSyntax) {
    super();
    this.table = table;
  }

  public kind(): NodeType {
    return NodeType.SelectExpressionSyntax;
  }

  public visit() {
    const table = this.table.visit();
    const data = fs
      .readFileSync(path.resolve(FileManager.FILES_DIR, `${table}.json`))
      .toString();

    const tuples = JSON.parse(data).tuples;
    console.table(tuples);
    return `Select executed with success. Exit code: 0. Rows: ${tuples.length}`;
  }
}
