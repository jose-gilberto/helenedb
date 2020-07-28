import Catalog from './Catalog';

describe('Catalog class', () => {
  test('Should return a valid string on attr name', () => {
    const stu = new Catalog('ANSI');
    expect(typeof stu.getName()).toBe('string');
    expect(stu.getName()).toMatch(/[a-zA-Z_]+([a-zA-Z0-9_]*)/);
  });

  test('Should return an array on attr schemas', () => {
    const stu = new Catalog('ANSI');
    expect(Array.isArray(stu.getSchemas())).toBe(true);
  });

  test('Should return an array on attr authorizedUsers', () => {
    const stu = new Catalog('ANSI');
    expect(Array.isArray(stu.getAuthorizedUsers())).toBe(true);
  });

  test('Should return true for root user', () => {
    const stu = new Catalog('ANSI');
    expect(stu.hasPermission('root')).toBe(true);
  });

  test('Should return false for any other user', () => {
    const stu = new Catalog('ANSI');
    expect(stu.hasPermission('user')).toBe(false);
  });

  test('Shoud return true if the user has added', () => {
    const stu = new Catalog('ANSI');
    expect(stu.authorizeUser('username')).toBe(true);
  });

  test('Shoud return true if the user has removed', () => {
    const stu = new Catalog('ANSI');
    stu.authorizeUser('username');
    expect(stu.removeAuthorization('username')).toBe(true);
  });

  test('Should return false for any schema', () => {
    const stu = new Catalog('ANSI');
    expect(stu.hasSchema('schema')).toBe(false);
  });

  test('Should return true if the schema has added', () => {
    const stu = new Catalog('ANSI');
    expect(stu.addSchema('schema')).toBe(true);
  });

  test('Shoud return true if the user has removed', () => {
    const stu = new Catalog('ANSI');
    stu.addSchema('schema');
    expect(stu.removeSchema('schema')).toBe(true);
  });

  test('Shoud return false because the schema already exists', () => {
    const stu = new Catalog('ANSI');
    stu.addSchema('schema');
    expect(stu.addSchema('schema')).toBe(false);
  });

  test('Shoud return false because the user is already authorized', () => {
    const stu = new Catalog('ANSI');
    stu.authorizeUser('username');
    expect(stu.authorizeUser('username')).toBe(false);
  });

  test("Should return false because the schema doesn't exist", () => {
    const stu = new Catalog('ANSI');
    expect(stu.removeSchema('schema')).toBe(false);
  });

  test("Should return false because the user doesn't have authorization", () => {
    const stu = new Catalog('ANSI');
    expect(stu.removeAuthorization('username')).toBe(false);
  });
});
