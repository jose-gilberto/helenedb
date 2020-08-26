import AlgebraTree from './structures/AlgebraTree';
import SymbolTable from '../../symbol-table/SymbolTable';
import TokenType from '../../lexer/token/TokenType';
import * as util from 'util';
import * as graphviz from 'graphviz';

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
  }

  public initialRepr(): AlgebraTree {
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

    const tree = new AlgebraTree();
    tree.addRoot(this.projectionList); // [ tbl.field ... ]

    if (this.selectionList.length > 0) {
      tree.addLeft(tree.getRoot(), 'σ', this.selectionList);
      tree.moveLeft();
      //  console.log(tree.getCurr())
    }

    this.tableList.forEach((addr, i) => {
      const tbl = this.symbolTable.getEntry(addr);
      if (i <= this.tableList.length - 2) {
        tree.addLeft(tree.getCurr(), 'x', []);
        tree.moveLeft();
        tree.addRight(tree.getCurr(), 'table', [tbl.name]);
      } else {
        tree.addLeft(tree.getCurr(), 'table', [tbl.name]);
      }
    });

    while (tree.getCurr().parent !== undefined) {
      if (tree.getCurr().type === 'x') {
        const avaliableData = tree
          .getCurr()
          .left?.value.concat(tree.getCurr().right?.value);
        if (avaliableData === undefined) {
          throw new Error();
        }
        tree.getCurr().value = avaliableData;
        tree.moveParent();
      } else {
        tree.moveParent();
      }
    }

    // tree.postOrder(tree.getRoot());

    return tree;

    // tables that will be used in this query
    // const tables: {
    //   [key: string]: {
    //     fields: Set<string>;
    //     conditions: number[];
    //   };
    // } = {};

    // this.tableList.forEach((addr) => {
    //   const table = this.symbolTable.getEntry(addr);
    //   tables[table.name] = {
    //     fields: new Set<string>(),
    //     conditions: [],
    //   };
    // });

    // console.log(tables);

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

    // let joins: { [key: string ]: any } = {}

    // if (this.tableList.length > 1) {
    //   let join: {
    //     tables: [string, string],
    //     condition: number[]
    //     avaliableTables: string[]
    //   }
    //   for (let i = 0; i < this.tableList.length; i++) {
    //     // tbl1 x tbl2
    //   }
    // }

    // console.log(tables);

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

  public optimizeTree(): void {
    const tables: {
      [key: string]: {
        fields: Set<string>;
        conditions: number[];
      };
    } = {};

    const joins: {
      [key: string]: {
        type: string;
        conditions: number[];
        tables: string[];
      };
    } = {};

    this.tableList.forEach((addr) => {
      const table = this.symbolTable.getEntry(addr);
      tables[table.name] = {
        fields: new Set<string>(),
        conditions: [],
      };
    });

    for (let i = 0; i < this.tableList.length - 1; i++) {
      if (i <= this.tableList.length - 2) {
        if (i == this.tableList.length - 2) {
          // last - 1
          const tbl1 = this.symbolTable.getEntry(this.tableList[i]);
          const tbl2 = this.symbolTable.getEntry(this.tableList[i + 1]);

          // console.log(tbl1, tbl2)

          // others
          joins[`join${i}`] = {
            type: 'x',
            conditions: [],
            tables: [tbl1.name, tbl2.name],
          };
        } else {
          const tbl = this.symbolTable.getEntry(this.tableList[i]);
          // others
          joins[`join${i}`] = {
            type: 'x',
            conditions: [],
            tables: [tbl.name, `join${i + 1}`],
          };
        }
      }
    }

    const optSelections: number[] = [];
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
          optSelections.push(index);
        } else {
          // 2 tables - search in joins
          Object.entries(joins).forEach(([key, value]) => {
            const tableNames: string[] = [];

            tablesSelection.forEach((el) => {
              tableNames.push(el);
            });

            // console.log(index, tableNames[0], tableNames[1])
            // const joinTables = [...joins[key].tables]

            // joinTables.forEach((el, index) => {
            //   if (el.match(/join[0-9]/)) {
            //     // console.log('match', key, value)
            //   }
            // })

            if (
              (value.tables.includes(tableNames[0]) ||
                value.tables.includes(tableNames[1])) &&
              (value.tables[0].match(/join[0-9]/) ||
                value.tables[1].match(/join[0-9]/))
            ) {
              // if include the 2 tables, add condition on this cartesian product
              // switch this carteasian product to join
              if (!optSelections.includes(index)) {
                joins[key].conditions.push(index);
                joins[key].type = '|x|';
                optSelections.push(index);
              }
            } else if (
              value.tables.includes(tableNames[0]) ||
              value.tables.includes(tableNames[1])
            ) {
              if (!optSelections.includes(index)) {
                joins[key].conditions.push(index);
                joins[key].type = '|x|';
                optSelections.push(index);
              }
            }
          });
        }
      }
    });

    const selection: Array<any> = [];

    this.selectionList.forEach((el, index) => {
      if (!optSelections.includes(index)) {
        selection.push(el);
      }
    });

    // Field opt
    this.projectionList.forEach((addr) => {
      const column = this.symbolTable.getEntry(addr);
      const table = this.symbolTable.getEntry(column.scope.parent);
      tables[table.name].fields.add(column.name);
    });

    this.selectionList.forEach((expr, index) => {
      if (typeof expr !== 'string') {
        // [ term1 relop term2 ]
        const terms = [expr[0], expr[2]];
        // tables envolved
        terms.forEach((term) => {
          if (term.type === TokenType.IDENTIFIER) {
            const field = this.symbolTable.getEntry(term.value);
            const table = this.symbolTable.getEntry(field.scope.parent);
            tables[table.name].fields.add(field.name);
          }
        });
      }
    });

    // console.log(this.projectionList);
    const projectionFields: string[] = [];
    this.projectionList.forEach((addr) => {
      const c = this.symbolTable.getEntry(addr);
      const t = this.symbolTable.getEntry(c.scope.parent);
      projectionFields.push(`${t.name}.${c.name}`);
    });

    // console.log(optSelections)
    // console.log(this.selectionList)

    const remainSelections = [
      ...this.selectionList.filter((el, id) => {
        return !optSelections.includes(id);
      }),
    ];
    const finalSelections = [];

    for (let i = 0; i < remainSelections.length; i++) {
      if (!optSelections.includes(i)) {
        if (typeof remainSelections[i] === 'string') {
          if (
            i - 1 >= 0 &&
            typeof remainSelections[i - 1] !== 'string' &&
            i + 1 < remainSelections.length &&
            remainSelections[i + 1] !== 'string'
          ) {
            finalSelections.push(i);
          }
        } else {
          finalSelections.push(i);
        }
      }
    }

    // console.log(finalSelections)

    const optTree: { [key: string]: any } = {
      type: 'projection',
      variant: 'array',
      statement: projectionFields,
      child: [],
    };

    if (finalSelections.length > 0) {
      // Do this
    } else {
      let node = optTree;

      if (Object.keys(joins).length === 0) {
        const tableName = Object.keys(tables)[0];
        const table = tables[tableName];
        if (table.conditions.length > 0) {
          node['child'].push({
            type: 'selection',
            variant: 'array',
            statement: [
              ...this.selectionList.filter((el, id) =>
                table.conditions.includes(id)
              ),
            ],
            child: [
              {
                type: 'projection',
                variant: 'set',
                statement: Array.from(table.fields),
                child: [
                  {
                    type: 'table',
                    variant: 'string',
                    statement: tableName,
                  },
                ],
              },
            ],
          });
        } else {
          node['child'].push({
            type: 'projection',
            variant: 'set',
            statement: Array.from(table.fields),
            child: [
              {
                type: 'table',
                variant: 'string',
                statement: tableName,
              },
            ],
          });
        }
      }

      Object.keys(joins).forEach((join) => {
        node['child'].push({
          type: 'join',
          variant: 'array',
          statement: [
            ...this.selectionList.filter((el, id) =>
              joins[join].conditions.includes(id)
            ),
          ],
          child: [],
        });
        node = node['child'][node['child'].length - 1];
        joins[join].tables.forEach((el) => {
          if (!el.match(/join[0-9]/)) {
            const table = tables[el];
            if (table.conditions.length > 0) {
              node['child'].push({
                type: 'selection',
                variant: 'array',
                statement: [
                  ...this.selectionList.filter((el, id) =>
                    table.conditions.includes(id)
                  ),
                ],
                child: [
                  {
                    type: 'projection',
                    variant: 'set',
                    statement: Array.from(table.fields),
                    child: [
                      {
                        type: 'table',
                        variant: 'string',
                        statement: el,
                      },
                    ],
                  },
                ],
              });
            } else {
              node['child'].push({
                type: 'projection',
                variant: 'set',
                statement: Array.from(table.fields),
                child: [
                  {
                    type: 'table',
                    variant: 'string',
                    statement: el,
                  },
                ],
              });
            }
          }
        });
      });
    }

    console.log(JSON.stringify(optTree));

    // for (let i = 0; i < selection.length; i++) {
    //   const el = selection[i]
    //   if ((el === 'AND' || el === 'OR') && (i % 2 === 0)) {
    //     selection.splice(i, 1)
    //   }
    // }

    // console.log(tables)
    // console.log(joins)
    // console.log(selection)

    // Generate the tree
    // const pList = this.projectionList.map((addr) =>
    //   this.symbolTable.getEntry(addr)
    // );

    // const pListStr = pList.map((e) => {
    //   const tbl = this.symbolTable.getEntry(e.scope.parent);
    //   return `${tbl.name}.${e.name}`;
    // });

    // // Add Projection
    // const proj = `π(${pListStr.reduce((str, tbl) => `${str}, ${tbl}`)})`

    // const sList = this.selectionList.map((el) => {
    //   if (typeof el !== 'string') {
    //     // array
    //     let term1, term2: string

    //     if (el[0].type === TokenType.IDENTIFIER) {
    //       const column = this.symbolTable.getEntry(el[0].value)
    //       const table = this.symbolTable.getEntry(column.scope.parent)
    //       term1 = `${table.name}.${column.name}`
    //     } else {
    //       term1 = el[0].value
    //     }

    //     if (el[2].type === TokenType.IDENTIFIER) {
    //       const column = this.symbolTable.getEntry(el[2].value)
    //       const table = this.symbolTable.getEntry(column.scope.parent)
    //       term2 = `${table.name}.${column.name}`
    //     } else {
    //       term2 = el[2].value
    //     }

    //     return `${term1} ${el[1]} ${term2}`
    //   } else {
    //     return ` ${el} `
    //   }
    // })

    // const sListStr = sList.join('')
    // const sel = `σ(${sListStr})`

    // console.log(Object.keys(joins))

    // const g = graphviz.digraph('G')
    // // Projections
    // let n1 = g.addNode(proj)
    // let n2 = g.addNode(sel)

    // g.addEdge(n1, n2)
    // n1 = n2
    // // n2 = null

    // if (Object.keys(joins).length > 0) {
    //   Object.keys(joins).forEach(el => {
    //     const join = joins[el]
    //     n2 = g.addNode(`${join.type}[${join.conditions}]`)
    //     g.addEdge(n1, n2)
    //     n1 = n2
    //     // join.tables.forEach(tbl => {
    //     //   if (tbl.) {

    //     //   }
    //     // })
    //   })
    // } else {
    //   // dont have joins
    // }

    // console.log(g.to_dot())

    // console.log(tables);
    // console.log(joins);
  }
}
