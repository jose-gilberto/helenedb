import SymbolTable from './SymbolTable';

describe('Symbol Table class', () => {
  test('Should return the new symbol address on lexer add', () => {
    const stu = new SymbolTable();
    expect(typeof stu.lexerEntry('table')).toBe('number');
  });

  test('Should return an entry', () => {
    const stu = new SymbolTable();
    const addr = stu.lexerEntry('table');
    expect(typeof stu.getEntry('table', addr)).toBe('object');
  });

  test('Should return true for the entry', () => {
    const stu = new SymbolTable();
    // stu.lexerEntry('table')
    // expect(stu.entryExists('table')).toBe(true)
  });

  test('Should return false for the entry', () => {
    const stu = new SymbolTable();
  });
});
