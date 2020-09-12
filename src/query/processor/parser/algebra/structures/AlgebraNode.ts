export default interface AlgebraNode {
  type: string;
  value: any[];
  left?: AlgebraNode;
  right?: AlgebraNode;
  parent?: AlgebraNode;
}
