import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';
import fs from 'fs';
import path from 'path';
import FileManager from '../../../../../data/file/FileManager';

export default class CreateTableExpressionSyntax extends ExpressionSyntax {
  public identifier: ExpressionSyntax;
  public columns: ExpressionSyntax[];

  constructor(identifier: ExpressionSyntax, columns: ExpressionSyntax[]) {
    super();
    this.identifier = identifier;
    this.columns = columns;
  }

  public kind(): NodeType {
    return NodeType.CreateTableExpressionSyntax;
  }

  public visit() {
    const columns: any[] = [];

    this.columns.forEach((c) => {
      columns.push(c.visit());
    });

    const table = {
      metadata: {
        name: this.identifier.visit(),
        columns: columns,
      },
      tuples: [],
    };

    fs.writeFile(
      path.resolve(FileManager.FILES_DIR, `${table.metadata.name}.json`),
      JSON.stringify(table),
      (err) => {
        if (err) throw err;
      }
    );

    return 'Table create with success.';
  }
}
