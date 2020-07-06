import SymbolTable from '../symbol-table/SymbolTable';
import LexerStream from '../lexer/LexerStream';
import Token from '../lexer/token/Token';
import TokenType from '../lexer/token/TokenType';

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

  private startParser(): void {
    this.stmt();
  }
}
