import Lexer from '../lexer/Lexer';
import Token from '../lexer/token/Token';
import TokenType from '../lexer/token/TokenType';
import ExpressionSyntax from './ast/ExpressionSyntax';
import CreateColumnExpressionSyntax from './ast/operations/CreateColumnExpressionSyntax';
import CreateTableExpressionSyntax from './ast/operations/CreateTableExpressionSyntax';
import InsertExpressionSyntax from './ast/operations/InsertExpressionSyntax';
import IdentifierExpressionSyntax from './ast/primary/IdentifierExpressionSyntax';
import IntegerExpressionSyntax from './ast/primary/IntegerExpressionSyntax';
import TextExpressionSyntax from './ast/primary/TextExpressionSyntax';
import SelectExpressionSyntax from './ast/statements/SelectExpressionSyntax';
import DataTypeExpressionSyntax from './ast/structures/DataTypeExpressionSyntax';

export default class Parser {
  private ast: ExpressionSyntax | undefined;
  private lexer: Lexer;
  private current: Token;

  constructor(program: string) {
    this.lexer = new Lexer(program);
    this.current = this.lexer.nextToken();
  }

  private match(type: TokenType): void {
    if (this.current.getType() === type) this.current = this.lexer.nextToken();
    else throw new Error(`Expect a ${type} got a ${this.current.getType()}`);
  }

  private parseIdentifier(): ExpressionSyntax {
    const node = new IdentifierExpressionSyntax(this.current);
    this.match(TokenType.IdentifierToken);
    return node;
  }

  private parseSelectStatement(): ExpressionSyntax {
    // SELECT * FROM <identifier> ;
    this.match(TokenType.SelectKeyword);
    this.match(TokenType.StarToken);
    this.match(TokenType.FromKeyword);

    const table = this.parseIdentifier();
    const node = new SelectExpressionSyntax(table);

    this.match(TokenType.SemicolonToken);
    return node;
  }

  private parseCreateColumnStatement(): ExpressionSyntax[] {
    // column TYPE
    // type -> INTEGER | VARCHAR([NUM])
    const columns: ExpressionSyntax[] = [];

    let column = this.parseIdentifier();
    let type = this.current.getValue(); // INTEGER | VARCHAR
    let size: number;

    if (this.current.getType() === TokenType.TextToken) {
      this.match(TokenType.TextToken);
      this.match(TokenType.OpenParenthesisToken);
      size = ~~this.current.getValue();
      this.match(TokenType.IntegerLiteral);
      this.match(TokenType.CloseParenthesisToken);
    } else if (this.current.getType() === TokenType.IntegerToken) {
      this.match(TokenType.IntegerToken);
      size = 4; // 4 Bytes
    } else throw new Error('Unsuported Data Type');
    columns.push(
      new CreateColumnExpressionSyntax(
        column,
        new DataTypeExpressionSyntax(type.toString(), size)
      )
    );

    // Continue
    while (TokenType.CommaToken === this.current.getType()) {
      this.match(TokenType.CommaToken);

      column = this.parseIdentifier();
      type = this.current.getValue(); // INTEGER | VARCHAR

      if (this.current.getType() === TokenType.TextToken) {
        this.match(TokenType.TextToken);
        this.match(TokenType.OpenParenthesisToken);
        size = ~~this.current.getValue();
        this.match(TokenType.IntegerLiteral);
        this.match(TokenType.CloseParenthesisToken);
      } else if (this.current.getType() === TokenType.IntegerToken) {
        this.match(TokenType.IntegerToken);
        size = 4; // 4 Bytes
      } else throw new Error('Unsuported Data Type');

      columns.push(
        new CreateColumnExpressionSyntax(
          column,
          new DataTypeExpressionSyntax(type.toString(), size)
        )
      );
    }

    return columns;
  }

  private parseCreateStatement() {
    // CREATE TABLE <identifier> ( [ column TYPE ]* );
    this.match(TokenType.CreateKeyword);
    this.match(TokenType.TableKeyword);

    const identifier = this.parseIdentifier();

    this.match(TokenType.OpenParenthesisToken);

    const columns = this.parseCreateColumnStatement();

    this.match(TokenType.CloseParenthesisToken);
    this.match(TokenType.SemicolonToken);

    return new CreateTableExpressionSyntax(identifier, columns);
  }

  private parseInsertStatement(): ExpressionSyntax {
    this.match(TokenType.InsertKeyword);
    this.match(TokenType.IntoKeyword);

    const table = this.parseIdentifier();

    this.match(TokenType.ValuesKeyword);

    // Read columns
    const values: ExpressionSyntax[] = [];

    this.match(TokenType.OpenParenthesisToken);

    if (this.current.getType() === TokenType.IntegerLiteral) {
      values.push(new IntegerExpressionSyntax(this.current));
      this.match(TokenType.IntegerLiteral);
    } else if (this.current.getType() === TokenType.TextLiteral) {
      values.push(new TextExpressionSyntax(this.current));
      this.match(TokenType.TextLiteral);
    } else {
      throw new Error(`Unsuported Literal: ${this.current.getType()}`);
    }

    while (this.current.getType() === TokenType.CommaToken) {
      this.match(TokenType.CommaToken);

      if (this.current.getType() === TokenType.IntegerLiteral) {
        values.push(new IntegerExpressionSyntax(this.current));
        this.match(TokenType.IntegerLiteral);
      } else if (this.current.getType() === TokenType.TextLiteral) {
        values.push(new TextExpressionSyntax(this.current));
        this.match(TokenType.TextLiteral);
      } else {
        throw new Error('Unsuported Literal');
      }
    }

    this.match(TokenType.CloseParenthesisToken);
    this.match(TokenType.SemicolonToken);

    return new InsertExpressionSyntax(table, values);
  }

  private parseStatement(): ExpressionSyntax {
    if (this.current.getType() === TokenType.SelectKeyword) {
      return this.parseSelectStatement();
    } else if (this.current.getType() === TokenType.CreateKeyword) {
      return this.parseCreateStatement();
    } else if (this.current.getType() === TokenType.InsertKeyword) {
      return this.parseInsertStatement();
    }
    throw new Error('Invalid Command!');
  }

  public parse(): ExpressionSyntax {
    this.ast = this.parseStatement();
    return this.ast;
  }

  public visit(): any {
    return this.ast?.visit();
  }
}
