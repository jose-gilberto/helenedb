import AlgebraTree from './structures/AlgebraTree';
import SymbolTable from '../../symbol-table/SymbolTable';
import TokenType from '../../lexer/token/TokenType';

interface Table {
  addr: number;
  name: string;
}

interface Field {
  addr: number;
  name: string;
}

interface Constant {
  type: string;
  name: string; // Content = Name
}

interface Expression {
  firstTerm: Term;
  relop: string;
  secndTerm: Term;
}

interface Term {
  desc: Constant | Field;
}

interface Join {
  type: string;
  tables: [Table, Table];
  condition: Expression;
}

interface ReprNode {
  value: string[];
  children: ReprNode[];
}

export default class QueryAlgebra {
  // TODO: implement order by and group by

  private projectionList: number[];
  private selectionList: Array<any>;

  private joinList: string[];
  private tableList: number[];

  // private repr: ReprTree
  // private optimizedRepr: ReprTree
  private plan: string[];
  private optPlan: string[];

  private symbolTable: SymbolTable;

  constructor(
    pList: number[],
    sList: Array<any>,
    jList: string[],
    tList: number[],
    sb: SymbolTable
  ) {
    this.projectionList = pList;
    this.selectionList = sList;
    this.joinList = jList;
    this.tableList = tList;
    this.plan = [];
    this.optPlan = [];
    this.symbolTable = sb;

    this.initialRepr();
  }

  private initialRepr(): void {
    const pList = this.projectionList.map((addr) =>
      this.symbolTable.getEntry(addr)
    );
    const pListStr = pList.map((e) => {
      const tbl = this.symbolTable.getEntry(e.scope.parent);
      return `${tbl.name}.${e.name}`;
    });

    //       prj
    //        |
    //    selection
    //        |
    //        X
    //       / \
    //      X  tbl1
    //     / \
    //  tbl2  tbl3

    // add root (proj)
    // add left (selection)
    // add left (X)
    // add left (X) - add right (tbl1)
    // add left (tbl2) - add right (tbl3)

    // const tree = new AlgebraTree()
    // tree.addRoot(pListStr)

    // tables that will be used in this query
    const tables: {
      [key: string]: {
        fields: Set<string>;
        conditions: number[];
      };
    } = {};

    this.tableList.forEach((addr) => {
      const table = this.symbolTable.getEntry(addr);
      tables[table.name] = {
        fields: new Set<string>(),
        conditions: [],
      };
    });

    console.log(tables);

    this.selectionList.forEach((expr, index) => {
      if (typeof expr !== 'string') {
        // [ term1 relop term2 ]
        const terms = [expr[0], expr[2]];
        // tables envolved
        const tablesSelection = new Set<string>();

        terms.forEach((term) => {
          if (term.type === TokenType.IDENTIFIER) {
            const field = this.symbolTable.getEntry(term.value);
            const table = this.symbolTable.getEntry(field.scope.parent);

            tablesSelection.add(table.name);
          }
        });
        if (tablesSelection.size === 1) {
          const tblName = tablesSelection.values().next().value;
          tables[tblName].conditions.push(index);
        }
        // console.log(index, tablesSelection)
      }
    });

    console.log(tables);

    // if (this.selectionList.length > 0)
    // tree.addLeft(tree.getRoot(), 'sel', )

    // only for debbug

    // determine the fields that will be returned in each table

    // this.tableList.forEach(addr => {
    //   let tbl = this.symbolTable.getEntry(addr)
    //   tables[tbl.name] = new Set<string>()
    // })

    // field
    // console.log(this.projectionList)

    // Step 1 - Break apart selection conditions

    // const fields = []
    // // [ {} , '', {} ]
    // this.selectionList.forEach(sel => {

    // })
  }
}
