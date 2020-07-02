import TokenType from './token/TokenType';
import Token from './token/Token';
import SymbolTable from '../symbol-table/SymbolTable';

export default class Lexer {
  private readonly KEYWORDS: TokenType[] = [
    TokenType.AUTHORIZATION,
    TokenType.CREATE,
    TokenType.SCHEMA,
  ];

  private readonly DATATYPES = [TokenType.INTEGER];

  private tokens: Token[];
  private programCounter: number;
  private lineCounter: number;
  private colCounter: number;
  private symbolTable: SymbolTable;

  constructor(symbolTable: SymbolTable) {
    this.symbolTable = symbolTable;
    this.tokens = [];
    this.lineCounter = 1;
    this.programCounter = 0;
    this.colCounter = 0;
  }

  // public numberAutomata(sourceCode: string): Token {
  //   throw new Error('Unsurported operation')
  // }

  // public textDateAutomata(sourceCode: string): Token {
  //   throw new Error('Unsurported operation')
  // }

  public identifierAutomata(sourceCode: string): Token {
    let state = 0,
      lexem = '';
    while (this.programCounter < sourceCode.length) {
      const currChar = sourceCode[this.programCounter];
      switch (state) {
        case 0:
          if (currChar == undefined || !currChar.match(/[_a-zA-Z]/)) {
            state = 1;
            continue;
          } else {
            state = 0;
            lexem += currChar;
            this.colCounter++;
            this.programCounter++;
            continue;
          }
        case 1:
          if (this.KEYWORDS.includes(lexem.toUpperCase() as TokenType)) {
            // TODO: implements token line and col
            const tType = lexem.toUpperCase() as TokenType;
            return new Token(tType, '');
          }

          // Support Data Types
          if (this.DATATYPES.includes(lexem.toUpperCase() as TokenType)) {
            const tType = lexem.toUpperCase() as TokenType;
            return new Token(tType, '');
          }

          // TODO: implements token to receive lexem and addr
          return new Token(
            TokenType.IDENTIFIER,
            `${lexem};${this.symbolTable.lexerEntry(lexem)}`
          );
      }
    }
    throw new Error('Stack overflow');
  }

  public symbolsAutomata(sourceCode: string): Token {
    let state = 0;
    while (this.programCounter < sourceCode.length) {
      const currChar = sourceCode[this.programCounter];
      switch (state) {
        case 0:
          if (currChar == ';') {
            state = 1;
            this.programCounter++;
            this.colCounter++;
            continue;
          } else {
            throw Error('Not suported yet');
          }
          break;
        case 1:
          return new Token(TokenType.SEMICOLON, '');
      }
    }
    throw new Error('Stack overflow');
  }

  // public separatorsAutomata(sourceCode: string): Token {
  //   throw new Error('Unsurported operation')
  // }

  // public operatorsAutomata(sourceCode: string): Token {
  //   throw new Error('Unsurported operation')
  // }

  // public relopAutomata(sourceCode: string): Token {
  //   throw new Error('Unsurported operation')
  // }

  public start(sourceCode: string): Token[] {
    this.scanner(sourceCode);
    return this.tokens;
  }

  public scanner(sourceCode: string): void {
    while (this.programCounter < sourceCode.length) {
      const currChar = sourceCode[this.programCounter];

      if (currChar == ' ' || currChar == '\t') {
        // spaces or tabs
        this.programCounter++;
        this.colCounter++;
        continue;
      } else if (currChar == '\r' || currChar == '\n') {
        // line breakers
        this.programCounter++;
        this.lineCounter++;
        this.colCounter = 0;
        continue;
      } else if (currChar.match(/[_a-zA-Z]/)) {
        // identifier, keywords or datatypes
        this.tokens.push(this.identifierAutomata(sourceCode));
      } else if (currChar.match(/[.,;]/)) {
        // symbols like: . ,
        this.tokens.push(this.symbolsAutomata(sourceCode));
      }
      // else if (currChar.match(/[0-9]/)) {
      //   // numbers
      //   this.tokens.push(this.numberAutomata(sourceCode))
      // } else if (currChar.match(/[()]/)) {
      //   // separators like: ( )
      //   this.tokens.push(this.separatorsAutomata(sourceCode))
      // } else if (currChar.match(/[+-/*]/)) {
      //   // operators like: + - / *
      //   this.tokens.push(this.operatorsAutomata(sourceCode))
      // } else if (currChar == '\'') {
      //   // text or data
      //   this.tokens.push(this.textDateAutomata(sourceCode))
      // } else if (currChar.match(/[=><!]/)) {
      //   // relational operators
      //   this.tokens.push(this.relopAutomata(sourceCode))
      // }
      else {
        throw Error('Lexical Error');
      }
    }
  }
}
