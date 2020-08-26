export default interface Statement {
  type: 'statement' | 'identifier' | 'map' | 'join' | 'expression' | 'literal';
  variant:
    | 'list'
    | 'select'
    | 'column'
    | 'join'
    | 'table'
    | 'cross join'
    | 'operation'
    | 'text'
    | 'date'
    | 'decimal';
  statement: Statement[];
  result?: Statement[];
  name?: string;
}
