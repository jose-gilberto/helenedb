import Token from '../../../lexer/token/Token';
import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';

export default class TextExpressionSyntax extends ExpressionSyntax {
  public token: Token;
  public value: string;

  constructor(text: Token) {
    super();
    this.token = text;
    this.value = text.getValue().toString();
  }

  public kind(): NodeType {
    return NodeType.TextExpressionSyntax;
  }
  public visit() {
    return this.value;
  }
}
