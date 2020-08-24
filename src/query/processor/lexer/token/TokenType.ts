enum TokenType {
  /**
   * Tokens Specification
   * TokenEnum = TokenString // token regex
   */
  // - Identifier
  IdentifierToken = 'IdentifierToken', // [A-Za-z_][A-Za-z0-9_]*
  // - DataTypes
  IntegerToken = 'Integer', // int
  DateToken = 'Date', // date
  FloatToken = 'Float', // float
  TextToken = 'Text', // text
  BoolToken = 'Bool', // bool
  // Constant Literals
  IntegerLiteral = 'NumberLiteral', // [0-9]*
  FloatLiteral = 'FloatLiteral', // ([0-9]*[.])?[0-9]+([eE][-+]?\d+)?
  TextLiteral = 'TextLiteral', // '(?:\.|(\\\')|[^\''\n])*'
  DateLiteral = 'DateLiteral', // TODO: add suport for datetime
  BoolLiteral = 'BoolLiteral', // true or false
  // Separators
  OpenParenthesisToken = 'OpenParenthesisToken', // (
  CloseParenthesisToken = 'CloseParenthesisToken', // )
  OpenBracketToken = '[', // [
  CloseBracketToken = ']', // ]
  // OpenBraceToken = '{', // {
  // CloseBraceToken = '}', // }
  // Operators
  PlusToken = 'PlusToken', // +
  MinusToken = 'MinusToken', // -
  SlashToken = 'SlashToken', // /
  StarToken = 'StarToken', // *
  // Relational Operators
  EqualsToken = '=', // =
  LessToken = '<', // <
  LessOrEqualsToken = '<=', // <=
  GreaterToken = '>', // >
  GreaterOrEqualsToken = '>=', // >=
  BangEqualsToken = '!=', // !=
  // Symbols
  SemicolonToken = ';', // ;
  DotToken = '.', // .
  ColonToken = ':', // :
  CommaToken = ',', // ,
  // Keywords
  AddKeyword = 'ADD',
  AllKeyword = 'ALL',
  AlterKeyword = 'ALTER',
  AndKeyword = 'AND',
  AsKeyword = 'AS',
  AscKeyword = 'ASC',
  AuthorizationKeyword = 'AUTHORIZATION',
  BetweenKeyword = 'BETWEEN',
  ByKeyword = 'BY',
  ColumnKeyword = 'COLUMN',
  ConstraintKeyword = 'CONSTRAINT',
  CreateKeyword = 'CREATE',
  DeleteKeyword = 'DELETE',
  DescKeyword = 'DESC',
  DistinctKeyword = 'DISTINCT',
  DropKeyword = 'DROP',
  ExistsKeyword = 'EXISTS',
  ExplainKeyword = 'EXPLAIN',
  ForeignKeyword = 'FOREIGN',
  FromKeyword = 'FROM',
  GroupKeyword = 'GROUP',
  HavingKeyword = 'HAVING',
  InKeyword = 'IN',
  IncludeKeyword = 'INCLUDE',
  IndexKeyword = 'INDEX',
  InsertKeyword = 'INSERT',
  IntoKeyword = 'INTO',
  KeyKeyword = 'KEY',
  LikeKeyword = 'LIKE',
  LimitKeyword = 'LIMIT',
  NotKeyword = 'NOT',
  NullKeyword = 'NULL',
  OnKeyword = 'ON',
  OrKeyword = 'OR',
  OrderKeyword = 'ORDER',
  PrimaryKeyword = 'PRIMARY',
  SelectKeyword = 'SELECT',
  SetKeyword = 'SET',
  TableKeyword = ' TABLE',
  UpdateKeyword = 'UPDATE',
  SschemaKeyword = 'SCHEMA',
  ValuesKeyword = 'VALUES',
  ViewKeyword = 'VIEW',
  WhereKeyword = 'WHERE',
  // Scape Characters
  EofToken = '/0',
  WhitespaceToken = 'WhitespaceToken',
  BadToken = 'BadToken',
  // Comments
}

export default TokenType;
