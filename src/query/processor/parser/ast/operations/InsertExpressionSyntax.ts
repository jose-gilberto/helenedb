import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';
import fs from 'fs';
import path from 'path';
import FileManager from '../../../../../data/file/FileManager';

export default class InsertExpressionSyntax extends ExpressionSyntax {
  public table: ExpressionSyntax;
  public values: ExpressionSyntax[];

  constructor(table: ExpressionSyntax, values: ExpressionSyntax[]) {
    super();
    this.table = table;
    this.values = values;
  }

  public kind(): NodeType {
    return NodeType.InsertExpressionSyntax;
  }

  public visit() {
    // Read the table
    const table = this.table.visit();

    const tableFile = JSON.parse(
      fs
        .readFileSync(path.resolve(FileManager.FILES_DIR, `${table}.json`))
        .toString()
    );

    const tuple: { [key: string]: any } = {};
    this.values.forEach((v, index) => {
      const value = v.visit();
      tuple[tableFile.metadata.columns[index].column] = value;
    });

    tableFile.tuples.push(tuple);

    fs.writeFileSync(
      path.resolve(FileManager.FILES_DIR, `${table}.json`),
      JSON.stringify(tableFile)
    );

    return 'Insert executed with success. Exit code: 0';
  }
}
