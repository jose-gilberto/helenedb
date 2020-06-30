enum TokenType {
  // Identifiers
  IDENTIFIER = 'IDENTIFIER',

  // Constant Literals
  // NUMBER_LITERAL = 'NUMBER_LITERAL',
  // TEXT_LITERAL = 'TEXT_LITERAL',
  // DATE_LITERAL = 'DATE_LITERAL',
  // BOOL_LITERAL = 'BOOL_LITERAL',

  // Separators
  // LPAR = '(',
  // RPAR = ')',
  // LBRC = '[',
  // RBRC = ']',
  // LKEY = '{',
  // RKEY = '}',

  // Operators
  // ADD = '+',
  // MINUS = '-',
  // DIV = '/',
  // MULT = '*'

  // Relational Operators

  // Symbols
  SEMICOLON = ';',

  // Keywords
  AUTHORIZATION = 'AUTHORIZATION',
  CREATE = 'CREATE',
  SCHEMA = 'SCHEMA',
}

export default TokenType;
