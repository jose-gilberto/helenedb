import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

export default class JoinExpressionSyntax extends ExpressionSyntax {
  public kind(): NodeType {
    throw new Error('Method not implemented.');
  }
  public visit() {
    throw new Error('Method not implemented.');
  }
}
