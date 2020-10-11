import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';
import path from 'path';
import fs from 'fs';
import FileManager from '../../../../../data/file/FileManager';

export default class DropTableExpressionSyntax extends ExpressionSyntax {
  public table: ExpressionSyntax;

  constructor(table: ExpressionSyntax) {
    super();
    this.table = table;
  }

  public kind(): NodeType {
    return NodeType.DropTableExpressionSyntax;
  }
  public visit() {
    const table = this.table.visit();
    try {
      fs.unlinkSync(path.resolve(FileManager.FILES_DIR, `${table}.json`));
    } catch (err) {
      return 'Drop table failed. Exit code: 1';
    }

    return 'Drop table with success. Exit code: 0';
  }
}
