enum TokenType {
  // Identifiers
  IDENTIFIER = 'IDENTIFIER',

  // Constant Literals
  NUMBER_LITERAL = 'NUMBER_LITERAL',
  TEXT_LITERAL = 'TEXT_LITERAL',
  DATE_LITERAL = 'DATE_LITERAL',
  BOOL_LITERAL = 'BOOL_LITERAL',

  // DataTypes
  INTEGER = 'INTEGER',
  DATE = 'DATE',
  FLOAT = 'FLOAT',
  TEXT = 'TEXT',
  BOOL = 'BOOL',

  // Separators
  LPAR = '(',
  RPAR = ')',
  LBRC = '[',
  RBRC = ']',
  // LKEY = '{',
  // RKEY = '}',

  // Operators
  // ADD = '+',
  // MINUS = '-',
  // DIV = '/',
  // MULT = '*'

  // Relational Operators
  EQ = '=',
  LEQ = '<=',
  LESS = '<',
  GEQ = '>=',
  GRT = '>',
  DIFF = '!=',

  // Symbols
  SEMICOLON = ';',

  // Keywords
  ADD = 'ADD',
  ALL = 'ALL',
  ALTER = 'ALTER',
  AND = 'AND',
  AS = 'AS',
  ASC = 'ASC',
  AUTHORIZATION = 'AUTHORIZATION',
  BETWEEN = 'BETWEEN',
  BY = 'BY',
  COLUMN = 'COLUMN',
  CONSTRAINT = ' CONSTRAINT',
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  DESC = 'DESC',
  DISTINCT = 'DISTINC',
  DROP = 'DROP',
  EXISTS = 'EXISTS',
  EXPLAIN = 'EXPLAIN',
  FOREIGN = 'FOREIGN',
  FROM = 'FROM',
  GROUP = 'GROUP',
  HAVING = 'HAVING',
  IN = 'IN',
  INCLUDE = 'INCLUDE',
  INDEX = 'INDEX',
  INSERT = 'INSERT',
  INTO = 'INTO',
  KEY = 'KEY',
  LIKE = 'LIKE',
  LIMIT = 'LIMIT',
  NOT = 'NOT',
  NULL = 'NULL',
  ON = 'ON',
  OR = 'OR',
  ORDER = 'ORDER',
  PRIMARY = 'PRIMARY',
  SELECT = 'SELECT',
  SET = 'SET',
  TABLE = ' TABLE',
  UPDATE = 'UPDATE',
  SCHEMA = 'SCHEMA',
  VALUES = 'VALUES',
  VIEW = 'VIEW',
  WHERE = 'WHERE',
}

export default TokenType;
