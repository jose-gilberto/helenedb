import ExpressionSyntax from '../ExpressionSyntax';
import NodeType from '../SyntaxNodeType';
import Token from '../../../lexer/token/Token';

export default class IntegerExpressionSyntax extends ExpressionSyntax {
  public integer: Token;
  public value: number;

  constructor(integer: Token) {
    super();
    this.integer = integer;
    this.value = ~~integer.getValue();
  }

  public kind(): NodeType {
    return NodeType.IntegerExpressionSyntax;
  }

  public visit(): number {
    return this.value;
  }
}
