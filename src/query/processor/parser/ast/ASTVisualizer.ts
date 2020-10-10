import Parser from '../Parser';
import ExpressionSyntax from './ExpressionSyntax';
import IntegerExpressionSyntax from './primary/IntegerExpressionSyntax';
import BinaryExpressionSyntax from './operations/BinaryExpressionSyntax';

export default class ASTVisualizer {
  private parser: Parser;
  private nCount: number;

  private dotHeader: string[];
  private dotBody: string[];
  private dotFooter: string[];

  constructor(parser: Parser) {
    this.parser = parser;
    this.nCount = 1;
    this.dotHeader = [
      '' +
        'digraph ast {\n' +
        '  node [shape=circle, fontsize=12, fontname="Courier", height=.1]; \n' +
        '  ranksep=.3;' +
        '  edge [arrowsize=.5]',
    ];
    this.dotBody = [];
    this.dotFooter = ['}'];
  }
}
