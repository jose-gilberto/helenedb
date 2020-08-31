import NodeType from './SyntaxNodeType';

export default abstract class ExpressionSyntax {
  public abstract kind(): NodeType;
  public abstract visit(): any;
}
