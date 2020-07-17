export default interface AlgebraNode {
  type: string;
  value: string[];
  left?: AlgebraNode;
  right?: AlgebraNode;
  parent?: AlgebraNode;
}
