import Token from '../lexer/token/Token';
import Lexer from '../lexer/Lexer';
import TokenType from '../lexer/token/TokenType';
import IntegerExpressionSyntax from './ast/primary/IntegerExpressionSyntax';
import BinaryExpressionSyntax from './ast/operations/BinaryExpressionSyntax';
import ExpressionSyntax from './ast/ExpressionSyntax';
import UnaryExpressionSyntax from './ast/operations/UnaryExpressionSyntax';
import NoOperationExpressionSyntax from './ast/operations/NoOperationExpressionSyntax';
import CompoundExpressionSyntax from './ast/statements/CompoundExpressionSyntax';
import SelectExpressionSyntax from './ast/statements/SelectExpressionSyntax';
import IdentifierExpressionSyntax from './ast/primary/IdentifierExpressionSyntax';
import ColumnExpressionSyntax from './ast/structures/ColumnExpressionSyntax';
import TableExpressionSyntax from './ast/structures/TableExpressionSyntax';
import ProjectionExpressionSyntax from './ast/operations/ProjectionExpressionSyntax';

export default class Parser {
  private lexer: Lexer;
  private current: Token;
  private ast: ExpressionSyntax | undefined;

  constructor(program: string) {
    this.lexer = new Lexer(program);
    this.current = this.lexer.nextToken();
  }

  // private parsePrimaryNameOrCallExpression(): ExpressionSyntax {
  //   if (this.current.getType() === TokenType.OpenParenthesisToken) {
  //     this.eat(TokenType.OpenParenthesisToken)
  //     const node = this.expr()
  //     this.eat(TokenType.CloseParenthesisToken)
  //     return node
  //   }
  //   throw new Error();
  // }

  public match(type: TokenType): void {
    if (this.current.getType() === type) this.current = this.lexer.nextToken();
    else
      throw new SyntaxError(
        `Expect a ${type} token, receive a ${this.current.getType()} - ${this.current.getValue()}.`
      );
  }

  public parseParenthesizedExpression(): ExpressionSyntax {
    this.match(TokenType.OpenParenthesisToken);
    const node = this.parseBinaryExpression();
    this.match(TokenType.CloseParenthesisToken);
    return node;
  }

  public parseIntegerLiteral(): ExpressionSyntax {
    const token = this.current;
    this.match(TokenType.IntegerLiteral);
    return new IntegerExpressionSyntax(token);
  }

  public parsePrimaryExpression(): ExpressionSyntax {
    switch (this.current.getType()) {
      case TokenType.IntegerLiteral:
        return this.parseIntegerLiteral();
      case TokenType.OpenParenthesisToken: {
        return this.parseParenthesizedExpression();
      }
      case TokenType.PlusToken: {
        const token = this.current;
        this.match(TokenType.PlusToken);
        return new UnaryExpressionSyntax(token, this.parsePrimaryExpression());
      }
      case TokenType.MinusToken: {
        const token = this.current;
        this.match(TokenType.MinusToken);
        return new UnaryExpressionSyntax(token, this.parsePrimaryExpression());
      }
      default:
        throw new SyntaxError(
          `Unsuported Syntax: Expect a Primary Expression receive a ${this.current.getType()}`
        );
    }
  }

  public parsePrioritizedBinaryExpression(): ExpressionSyntax {
    let node: any = this.parsePrimaryExpression();
    while (
      this.current.getType() === TokenType.StarToken ||
      this.current.getType() === TokenType.SlashToken
    ) {
      const token = this.current;
      if (token.getType() === TokenType.StarToken) {
        this.match(TokenType.StarToken);
      } else if (token.getType() === TokenType.SlashToken) {
        this.match(TokenType.SlashToken);
      }
      node = new BinaryExpressionSyntax(
        node,
        token,
        this.parsePrimaryExpression()
      );
    }
    return node;
  }

  public parseBinaryExpression(): ExpressionSyntax {
    let node = this.parsePrioritizedBinaryExpression();
    while (
      this.current.getType() === TokenType.PlusToken ||
      this.current.getType() === TokenType.MinusToken
    ) {
      const token = this.current;
      if (token.getType() === TokenType.PlusToken) {
        this.match(TokenType.PlusToken);
      } else if (token.getType() === TokenType.MinusToken) {
        this.match(TokenType.MinusToken);
      }
      node = new BinaryExpressionSyntax(
        node,
        token,
        this.parsePrioritizedBinaryExpression()
      );
    }
    return node;
  }

  private parseNoOperationExpression(): ExpressionSyntax {
    return new NoOperationExpressionSyntax();
  }

  private parseIdentifier(): ExpressionSyntax {
    /*
      <identifier> -> ID
    */
    const node = new IdentifierExpressionSyntax(this.current);
    this.match(TokenType.IdentifierToken);
    return node;
  }

  private parseColumnRef(): ExpressionSyntax {
    /**
     * <column-ref> -> <identifier> . <identifier>
     */
    const table = this.parseIdentifier();
    this.match(TokenType.DotToken);
    const column = this.parseIdentifier();

    return new ColumnExpressionSyntax(column, table);
  }

  private parseColumnList(): ExpressionSyntax[] {
    /**
     * <column-list> -> <column-ref> , <column-list> | <column-ref>
     */
    const node = this.parseColumnRef();
    const result = [node];

    while (this.current.getType() === TokenType.CommaToken) {
      this.match(TokenType.CommaToken);
      result.push(this.parseColumnRef());
    }

    return result;
  }

  private parseTableList(): ExpressionSyntax {
    /**
     * <table-list> -> <table-ref> , <table-list> | <table-ref>
     */
    const node = this.parseTableRef();
    // while (this.current.getType() === TokenType.CommaToken) {
    //   this.match(TokenType.CommaToken);
    // }
    return node;
  }

  private parseTableRef(): ExpressionSyntax {
    /**
     * <table-ref> -> <identifier>
     */
    const table = this.parseIdentifier();
    return new TableExpressionSyntax(table);
  }

  private parseProjection(): ExpressionSyntax {
    /**
     * <projection-operation> -> <column-list> FROM <table-list>
     */
    const columns = this.parseColumnList();
    this.match(TokenType.FromKeyword);
    const tables = this.parseTableList();

    return new ProjectionExpressionSyntax(columns, tables);
  }

  private parseSelectStatement(): ExpressionSyntax {
    /**
     * <select-statement> -> SELECT <projection-operation>
     */
    this.match(TokenType.SelectKeyword);
    const node = this.parseProjection();

    return new SelectExpressionSyntax(node);
  }

  private parseStatement(): ExpressionSyntax {
    /**
     * <statement> -> <select-statement> | empty
     */
    let node: ExpressionSyntax;
    if (this.current.getType() === TokenType.SelectKeyword) {
      node = this.parseSelectStatement();
    } else {
      node = this.parseNoOperationExpression();
    }
    return node;
  }

  private parseStatementList(): ExpressionSyntax[] {
    /**
     * <statement-list> -> <statement> ; <statement-list> | <statement> ;
     */
    const node = this.parseStatement();
    this.match(TokenType.SemicolonToken);
    const results = [node];

    while (this.current.getType() !== TokenType.EofToken) {
      results.push(this.parseStatement());
      this.match(TokenType.SemicolonToken);
    }

    return results;
  }

  private parseCompoundStatement(): ExpressionSyntax {
    /**
     * <compound-statement> -> <statement-list>
     */
    const nodes = this.parseStatementList();

    const root = new CompoundExpressionSyntax();
    root.children = nodes;

    return root;
  }

  private parseProgram(): ExpressionSyntax {
    /**
     * <program> -> <compound-statement> EOF
     */
    const node = this.parseCompoundStatement();
    this.match(TokenType.EofToken); // TODO: verify if this is necessary
    return node;
  }

  public parse() {
    this.ast = this.parseProgram();
    // this.ast = this.parseBinaryExpression();
    return this.ast;
  }

  public visit(node: ExpressionSyntax): any {
    return this.ast?.visit();
  }
}
