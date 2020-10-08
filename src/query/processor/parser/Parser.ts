import Lexer from '../lexer/Lexer';
import Token from '../lexer/token/Token';
import TokenType from '../lexer/token/TokenType';
import ExpressionSyntax from './ast/ExpressionSyntax';
import IdentifierExpressionSyntax from './ast/primary/IdentifierExpressionSyntax';
import SelectExpressionSyntax from './ast/statements/SelectExpressionSyntax';

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

  private parseCreateStatement() {
    // CREATE TABLE <identifier> ( [ column TYPE ]* );
    this.match(TokenType.CreateKeyword);
    this.match(TokenType.TableKeyword);

    const identifier = this.parseIdentifier();

    this.match(TokenType.OpenParenthesisToken);
  }

  private parseStatement(): ExpressionSyntax {
    if (this.current.getType() === TokenType.SelectKeyword) {
      return this.parseSelectStatement();
    } else if (this.current.getType() === TokenType.CreateKeyword) {
      // TODO: Create Statement
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
