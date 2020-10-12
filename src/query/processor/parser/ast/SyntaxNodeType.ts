enum NodeType {
  BinaryExpressionSyntax,
  UnaryExpressionSyntax,
  IntegerExpressionSyntax,
  CompoundExpressionSyntax,
  SelectExpressionSyntax,
  NoOperationExpression,
  TableExpression,
  IdentifierExpression,
  ColumnExpression,
  CreateColumnExpressionSyntax,
  DataTypeExpressionSyntax,
  CreateTableExpressionSyntax,
  TextExpressionSyntax,
  InsertExpressionSyntax,
  DropTableExpressionSyntax,
  StarExpression,
  ProjectionExpression,
}

export default NodeType;
