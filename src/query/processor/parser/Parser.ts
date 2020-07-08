import SymbolTable from '../symbol-table/SymbolTable';
import LexerStream from '../lexer/LexerStream';
import Token from '../lexer/token/Token';
import TokenType from '../lexer/token/TokenType';
import SymbolTableEntry from '../symbol-table/SymbolTableEntry.interface';

export default class Parser {
  private actions: Array<string>;
  private symbolTable: SymbolTable;
  private tokenStream: LexerStream;

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

      // let columnAddr = this.symbolTable.add(columnEntry)

      // addr like id-number
      fieldList.push({
        table: table,
        column: column,
      });

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
      this.symbolTable.add(tableEntry);

      // addr like id-number
      tableList.push(table);

      if (this.tokenStream.getToken().getType() !== TokenType.COMMA) break;
      else {
        this.tokenStream.consumeSymbol(TokenType.COMMA);
      }
    }

    this.tokenStream.consumeSymbol(TokenType.SEMICOLON);
    console.log(fieldList);
    console.log(tableList);
  }

  private startParser(): void {
    this.stmt();
  }
}
