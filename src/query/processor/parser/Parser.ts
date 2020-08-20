import SymbolTable from '../symbol-table/SymbolTable';
import LexerStream from '../lexer/LexerStream';
import Token from '../lexer/token/Token';
import TokenType from '../lexer/token/TokenType';
import SymbolTableEntry from '../symbol-table/SymbolTableEntry.interface';
import QueryAlgebra from './algebra/QueryAlgebra';
import Optimizer from '../../optimizer/Optmizer';
import AlgebraTree from './algebra/structures/AlgebraTree';

export default class Parser {
  private actions: Array<string>;
  private symbolTable: SymbolTable;
  private tokenStream: LexerStream;
  private tree: AlgebraTree | undefined;
  private data: QueryAlgebra | undefined;

  constructor(tokenList: Array<Token>, symbolTable: SymbolTable) {
    this.tokenStream = new LexerStream(tokenList);
    this.symbolTable = symbolTable;
    this.actions = ['S', '$']; // TODO: implements actions
    this.startParser();
  }

  private stmt(): void {
    const token = this.tokenStream.getToken();
    // TODO: explain clause

    if (token.getType() === TokenType.CREATE) this.create();
    else if (
      token.getType() === TokenType.SELECT ||
      token.getType() === TokenType.EXPLAIN
    )
      this.select();
  }

  private create(): void {
    this.tokenStream.consumeKeyword(TokenType.CREATE);
    const token = this.tokenStream.getToken();

    if (token.getType() === TokenType.SCHEMA) this.createSchema();
  }

  private createSchema(): void {
    this.tokenStream.consumeKeyword(TokenType.SCHEMA);

    const schemaAddr = this.tokenStream.consumeIdentifier();
    console.log(schemaAddr);

    if (this.tokenStream.getToken().getType() === TokenType.SEMICOLON) {
      // public schema
      this.tokenStream.consumeSymbol(';');
    } else {
      // Authorization Clause
      this.tokenStream.consumeKeyword(TokenType.AUTHORIZATION);

      const userAddr = this.tokenStream.consumeIdentifier();
      console.log(userAddr);

      this.tokenStream.consumeSymbol(';');
    }
  }

  private select(): void {
    // Explain support
    // const explain = (this.tokenStream.getToken().getType() === TokenType.EXPLAIN) ? true : false;

    // TODO: add suport to GROUP BY and ORDER BY
    // <select-stmt> -> SELECT <field-list> FROM <tbl-list> <where-stmt>
    // consume SELECT on stack
    this.tokenStream.consumeKeyword(TokenType.SELECT);

    // <field-list> -> <field-def> <ofield-def>
    // <field-def> -> IDENTIFIER.IDENTIFIER
    // <ofield-def> -> EPSILON | <field-list>

    const fieldList = [];

    while (this.tokenStream.getToken() != undefined) {
      // { tbl: id, field: field }

      const table = this.tokenStream.consumeIdentifier();
      const tableEntry: SymbolTableEntry = {
        name: table,
        scope: {
          type: 0,
          parent: -1,
        },
        type: 'table',
      };

      const tableAddr = this.symbolTable.add(tableEntry);

      this.tokenStream.consumeSymbol(TokenType.DOT);

      const column = this.tokenStream.consumeIdentifier();
      const columnEntry: SymbolTableEntry = {
        name: column,
        scope: {
          type: 1,
          parent: tableAddr,
        },
        type: 'column',
      };

      const columnAddr = this.symbolTable.add(columnEntry);

      // addr like id-number
      fieldList.push(columnAddr);

      if (this.tokenStream.getToken().getType() !== TokenType.COMMA) break;
      else {
        this.tokenStream.consumeSymbol(TokenType.COMMA);
      }
    }

    // consume FROM on stack
    this.tokenStream.consumeKeyword(TokenType.FROM);

    const tableList = [];

    while (this.tokenStream.getToken() != undefined) {
      const table = this.tokenStream.consumeIdentifier();
      const tableEntry: SymbolTableEntry = {
        name: table,
        scope: {
          type: 0,
          parent: -1,
        },
        type: 'table',
      };
      const tableAddr = this.symbolTable.add(tableEntry);

      // addr like id-number
      tableList.push(tableAddr);

      if (this.tokenStream.getToken().getType() !== TokenType.COMMA) break;
      else {
        this.tokenStream.consumeSymbol(TokenType.COMMA);
      }
    }

    // <where-stmt> -> EPSILON | WHERE <predicate>
    // <predicate> -> <term-nd> <term-or>
    // <term-or> -> EPSILON | OR <term-nd> <term-or>
    // <term-nd> -> <expr> <term-n>
    // <term-n> -> AND <expr> <term-n> | EPSILON
    // <expr> -> <term> <relop> <term>
    // <term> -> <constant> | <field>
    const predicate = new Array<any>();

    if (this.tokenStream.getToken().getType() === TokenType.WHERE) {
      // WHERE clause
      // consume WHERE
      this.tokenStream.consumeKeyword(TokenType.WHERE);

      let expr = [];

      // TODO: create consumeTerm function on lexer stream
      if (this.tokenStream.getToken().getType() === TokenType.DATE_LITERAL) {
        expr.push({
          type: TokenType.DATE_LITERAL,
          value: this.tokenStream.consumeDate(),
        });
      } else if (
        this.tokenStream.getToken().getType() === TokenType.TEXT_LITERAL
      ) {
        expr.push({
          type: TokenType.TEXT_LITERAL,
          value: this.tokenStream.consumeText(),
        });
      } else if (
        this.tokenStream.getToken().getType() === TokenType.NUMBER_LITERAL
      ) {
        expr.push({
          type: TokenType.NUMBER_LITERAL,
          value: this.tokenStream.consumeNumber(),
        });
      } else {
        const table = this.tokenStream.consumeIdentifier();
        const tableEntry: SymbolTableEntry = {
          name: table,
          scope: {
            type: 0,
            parent: -1,
          },
          type: 'table',
        };
        const tableAddr = this.symbolTable.add(tableEntry);

        this.tokenStream.consumeSymbol(TokenType.DOT);

        const column = this.tokenStream.consumeIdentifier();
        const columnEntry: SymbolTableEntry = {
          name: column,
          scope: {
            type: 1,
            parent: tableAddr,
          },
          type: 'column',
        };
        const columnAddr = this.symbolTable.add(columnEntry);

        expr.push({
          type: TokenType.IDENTIFIER,
          value: columnAddr,
        });
      }

      const relop = this.tokenStream.consumeRelop();
      expr.push(relop);

      if (this.tokenStream.getToken().getType() === TokenType.DATE_LITERAL) {
        expr.push({
          type: TokenType.DATE_LITERAL,
          value: this.tokenStream.consumeDate(),
        });
      } else if (
        this.tokenStream.getToken().getType() === TokenType.TEXT_LITERAL
      ) {
        expr.push({
          type: TokenType.TEXT_LITERAL,
          value: this.tokenStream.consumeText(),
        });
      } else if (
        this.tokenStream.getToken().getType() === TokenType.NUMBER_LITERAL
      ) {
        expr.push({
          type: TokenType.NUMBER_LITERAL,
          value: this.tokenStream.consumeNumber(),
        });
      } else {
        const table = this.tokenStream.consumeIdentifier();
        const tableEntry: SymbolTableEntry = {
          name: table,
          scope: {
            type: 0,
            parent: -1,
          },
          type: 'table',
        };
        const tableAddr = this.symbolTable.add(tableEntry);

        this.tokenStream.consumeSymbol(TokenType.DOT);

        const column = this.tokenStream.consumeIdentifier();
        const columnEntry: SymbolTableEntry = {
          name: column,
          scope: {
            type: 1,
            parent: tableAddr,
          },
          type: 'column',
        };
        const columnAddr = this.symbolTable.add(columnEntry);

        expr.push({
          type: TokenType.IDENTIFIER,
          value: columnAddr,
        });
      }

      predicate.push(expr);

      // WHERE camp = 12 AND x = y OR s = 3

      if (this.tokenStream.getToken() === undefined) {
        throw new Error('Syntax Error: Expect a ; Token');
      }

      while (
        this.tokenStream.getToken().getType() === TokenType.AND ||
        this.tokenStream.getToken().getType() === TokenType.OR
      ) {
        predicate.push(this.tokenStream.consumeAndOr());
        expr = [];

        if (this.tokenStream.getToken().getType() === TokenType.DATE_LITERAL) {
          expr.push({
            type: TokenType.DATE_LITERAL,
            value: this.tokenStream.consumeDate(),
          });
        } else if (
          this.tokenStream.getToken().getType() === TokenType.TEXT_LITERAL
        ) {
          expr.push({
            type: TokenType.TEXT_LITERAL,
            value: this.tokenStream.consumeText(),
          });
        } else if (
          this.tokenStream.getToken().getType() === TokenType.NUMBER_LITERAL
        ) {
          expr.push({
            type: TokenType.NUMBER_LITERAL,
            value: this.tokenStream.consumeNumber(),
          });
        } else {
          const table = this.tokenStream.consumeIdentifier();
          const tableEntry: SymbolTableEntry = {
            name: table,
            scope: {
              type: 0,
              parent: -1,
            },
            type: 'table',
          };
          const tableAddr = this.symbolTable.add(tableEntry);

          this.tokenStream.consumeSymbol(TokenType.DOT);

          const column = this.tokenStream.consumeIdentifier();
          const columnEntry: SymbolTableEntry = {
            name: column,
            scope: {
              type: 1,
              parent: tableAddr,
            },
            type: 'column',
          };
          const columnAddr = this.symbolTable.add(columnEntry);

          expr.push({
            type: TokenType.IDENTIFIER,
            value: columnAddr,
          });
        }

        const relop = this.tokenStream.consumeRelop();
        expr.push(relop);

        if (this.tokenStream.getToken().getType() === TokenType.DATE_LITERAL) {
          expr.push({
            type: TokenType.DATE_LITERAL,
            value: this.tokenStream.consumeDate(),
          });
        } else if (
          this.tokenStream.getToken().getType() === TokenType.TEXT_LITERAL
        ) {
          expr.push({
            type: TokenType.TEXT_LITERAL,
            value: this.tokenStream.consumeText(),
          });
        } else if (
          this.tokenStream.getToken().getType() === TokenType.NUMBER_LITERAL
        ) {
          expr.push({
            type: TokenType.NUMBER_LITERAL,
            value: this.tokenStream.consumeNumber(),
          });
        } else {
          const table = this.tokenStream.consumeIdentifier();
          const tableEntry: SymbolTableEntry = {
            name: table,
            scope: {
              type: 0,
              parent: -1,
            },
            type: 'table',
          };
          const tableAddr = this.symbolTable.add(tableEntry);

          this.tokenStream.consumeSymbol(TokenType.DOT);

          const column = this.tokenStream.consumeIdentifier();
          const columnEntry: SymbolTableEntry = {
            name: column,
            scope: {
              type: 1,
              parent: tableAddr,
            },
            type: 'column',
          };
          const columnAddr = this.symbolTable.add(columnEntry);

          expr.push({
            type: TokenType.IDENTIFIER,
            value: columnAddr,
          });
        }

        predicate.push(expr);
      }

      // console.log(predicate);
    }

    this.tokenStream.consumeSymbol(TokenType.SEMICOLON);

    // console.log(fieldList);
    // console.log(tableList);

    const qAlgebra = new QueryAlgebra(
      fieldList,
      predicate,
      [],
      tableList,
      this.symbolTable
    );

    this.tree = qAlgebra.initialRepr();
    this.data = qAlgebra;
  }

  public getTree(): AlgebraTree {
    if (this.tree === undefined) throw new Error();
    return this.tree;
  }

  public getData(): QueryAlgebra {
    if (this.data === undefined) throw new Error();
    return this.data;
  }

  private startParser(): void {
    this.stmt();
  }
}
