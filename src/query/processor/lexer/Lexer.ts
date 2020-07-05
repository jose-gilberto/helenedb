import TokenType from './token/TokenType';
import Token from './token/Token';
import SymbolTable from '../symbol-table/SymbolTable';

export default class Lexer {
  public static readonly KEYWORDS: TokenType[] = [
    TokenType.ADD,
    TokenType.ALL,
    TokenType.ALTER,
    TokenType.AND,
    TokenType.AS,
    TokenType.ASC,
    TokenType.AUTHORIZATION,
    TokenType.BETWEEN,
    TokenType.BY,
    TokenType.COLUMN,
    TokenType.CONSTRAINT,
    TokenType.CREATE,
    TokenType.DELETE,
    TokenType.DESC,
    TokenType.DISTINCT,
    TokenType.DROP,
    TokenType.EXISTS,
    TokenType.EXPLAIN,
    TokenType.FOREIGN,
    TokenType.FROM,
    TokenType.GROUP,
    TokenType.HAVING,
    TokenType.IN,
    TokenType.INCLUDE,
    TokenType.INDEX,
    TokenType.INSERT,
    TokenType.INTO,
    TokenType.KEY,
    TokenType.LIKE,
    TokenType.LIMIT,
    TokenType.NOT,
    TokenType.NULL,
    TokenType.ON,
    TokenType.OR,
    TokenType.ORDER,
    TokenType.PRIMARY,
    TokenType.SELECT,
    TokenType.SET,
    TokenType.TABLE,
    TokenType.UPDATE,
    TokenType.SCHEMA,
    TokenType.VALUES,
    TokenType.VIEW,
    TokenType.WHERE,
  ];

  public static readonly DATATYPES = [
    TokenType.INTEGER,
    TokenType.BOOL,
    TokenType.DATE,
    TokenType.FLOAT,
    TokenType.TEXT,
  ];

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

  public textDateAutomata(sourceCode: string): Token {
    let state = 0,
      lexem = '';
    while (this.programCounter < sourceCode.length) {
      const currChar = sourceCode[this.programCounter];
      switch (state) {
        case 0:
          if (currChar === "'") {
            state = 1;
            this.programCounter++;
            this.colCounter++;
            continue;
          } else {
            throw new Error('Lexical Error');
          }
        case 1:
          if (currChar === "'") {
            state = 2;
            this.programCounter++;
            this.colCounter++;
            continue;
          } else {
            state = 1;
            this.programCounter++;
            this.colCounter++;
            lexem += currChar;
            continue;
          }
        case 2:
          if (
            lexem.match(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/)
          ) {
            return new Token(TokenType.DATE, lexem);
          }
          return new Token(TokenType.TEXT_LITERAL, lexem);
      }
    }
    throw new Error('Unsurported operation');
  }

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
          if (Lexer.KEYWORDS.includes(lexem.toUpperCase() as TokenType)) {
            // TODO: implements token line and col
            const tType = lexem.toUpperCase() as TokenType;
            return new Token(tType, '');
          }

          // Support Data Types
          if (Lexer.DATATYPES.includes(lexem.toUpperCase() as TokenType)) {
            const tType = lexem.toUpperCase() as TokenType;
            return new Token(tType, '');
          }

          // TODO: implements token to receive lexem and addr
          return new Token(
            TokenType.IDENTIFIER,
            `${this.symbolTable.lexerEntry(lexem)}-${lexem}`
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

  public separatorsAutomata(sourceCode: string): Token {
    // [ ] ( )
    const state = 0;
    while (this.programCounter < sourceCode.length) {
      const currChar = sourceCode[this.programCounter];
      switch (state) {
        case 0:
          if (currChar == '(') {
            this.programCounter++;
            this.colCounter++;
            return new Token(TokenType.LPAR, '');
          } else if (currChar == ')') {
            this.programCounter++;
            this.colCounter++;
            return new Token(TokenType.RPAR, '');
          } else if (currChar == '[') {
            this.programCounter++;
            this.colCounter++;
            return new Token(TokenType.LBRC, '');
          } else if (currChar == ']') {
            this.programCounter++;
            this.colCounter++;
            return new Token(TokenType.RBRC, '');
          } else {
            throw new Error('Lexical Error');
          }
      }
    }
    throw new Error('Stack overflow');
  }

  public operatorsAutomata(sourceCode: string): Token {
    // + * - /
    const state = 0;
    while (this.programCounter < sourceCode.length) {
      const currChar = sourceCode[this.programCounter];
      switch (state) {
        case 0:
          if (currChar === '+') {
            this.programCounter++;
            this.colCounter++;
            return new Token(TokenType.PLUS, '');
          } else if (currChar === '-') {
            this.programCounter++;
            this.colCounter++;
            return new Token(TokenType.MINUS, '');
          } else if (currChar === '/') {
            this.programCounter++;
            this.colCounter++;
            return new Token(TokenType.DIV, '');
          } else if (currChar === '*') {
            this.programCounter++;
            this.colCounter++;
            return new Token(TokenType.MULT, '');
          } else {
            throw new Error('Lexical Error');
          }
      }
    }
    throw new Error('Stack overflow');
  }

  public relopAutomata(sourceCode: string): Token {
    // < <= >= = != <>
    let state = 0;
    while (this.programCounter < sourceCode.length) {
      const currChar = sourceCode[this.programCounter];
      switch (state) {
        case 0:
          if (currChar === '=') {
            state = 1;
            this.programCounter++;
            this.colCounter++;
            continue;
          } else if (currChar === '<') {
            state = 2;
            this.programCounter++;
            this.colCounter++;
            continue;
          } else if (currChar === '>') {
            state = 3;
            this.programCounter++;
            this.colCounter++;
            continue;
          } else if (currChar === '!') {
            state = 4;
            this.programCounter++;
            this.colCounter++;
            continue;
          } else {
            throw new Error('Lexical Error');
          }
        case 1:
          return new Token(TokenType.EQ, '');
        case 2:
          if (currChar === '=') {
            this.programCounter++;
            this.colCounter++;
            return new Token(TokenType.LEQ, '');
          } else {
            return new Token(TokenType.LESS, '');
          }
        case 3:
          if (currChar === '=') {
            this.programCounter++;
            this.colCounter++;
            return new Token(TokenType.GEQ, '');
          } else {
            return new Token(TokenType.GRT, '');
          }
        case 4:
          if (currChar === '=') {
            this.programCounter++;
            this.colCounter++;
            return new Token(TokenType.DIFF, '');
          } else {
            throw new Error('Lexical Error');
          }
      }
    }
    throw new Error('Stack overflow');
  }

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
