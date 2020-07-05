import TokenType from './TokenType';

describe('Token Type Enum', () => {
  test('Shoud return IDENTIFIER', () => {
    const stu = TokenType.IDENTIFIER;
    expect(stu).toBe('IDENTIFIER');
  });

  test('Shoud return ;', () => {
    const stu = TokenType.SEMICOLON;
    expect(stu).toBe(';');
  });

  test('Shoud return AUTHORIZATION', () => {
    const stu = TokenType.AUTHORIZATION;
    expect(stu).toBe('AUTHORIZATION');
  });

  test('Shoud return SCHEMA', () => {
    const stu = TokenType.SCHEMA;
    expect(stu).toBe('SCHEMA');
  });

  test('Shoud return CREATE', () => {
    const stu = TokenType.CREATE;
    expect(stu).toBe('CREATE');
  });
});
