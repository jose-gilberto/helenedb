import AlgebraTree from '../processor/parser/algebra/structures/AlgebraTree';
import SymbolTable from '../processor/symbol-table/SymbolTable';
import TokenType from '../processor/lexer/token/TokenType';

export default class Optimizer {
  public static optmizeQuery(
    tree: AlgebraTree,
    symbolTable: SymbolTable
  ): void {
    // this.selectionList.forEach((expr, index) => {
    //   if (typeof expr !== 'string') {
    //     // [ term1 relop term2 ]
    //     const terms = [expr[0], expr[2]];
    //     // tables envolved
    //     const tablesSelection = new Set<string>();
    //     terms.forEach((term) => {
    //       if (term.type === TokenType.IDENTIFIER) {
    //         const field = this.symbolTable.getEntry(term.value);
    //         const table = this.symbolTable.getEntry(field.scope.parent);
    //         tablesSelection.add(table.name);
    //       }
    //     });
    //     if (tablesSelection.size === 1) {
    //       const tblName = tablesSelection.values().next().value;
    //       tables[tblName].conditions.push(index);
    //     }
    //     // console.log(index, tablesSelection)
    //   }
    // });
    // Step 1 - Split the selection and execute then faster than possible
    // Step 2 -
    // Step 3 - Change cartesian products with selections after them by joins
    // Step 4 - Execute projections faster than possible
  }
}
