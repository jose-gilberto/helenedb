import AlgebraNode from './AlgebraNode';

export default class AlgebraTree {
  private root: AlgebraNode | null;
  private currTree: AlgebraNode | null;

  constructor() {
    this.root = null;
    this.currTree = this.root;
  }

  public getRoot(): AlgebraNode {
    if (this.root === null) {
      throw new Error('Empty tree');
    }
    return this.root;
  }

  public addRoot(value: any[]): AlgebraNode {
    this.root = {
      type: 'π',
      value: value,
    };
    this.currTree = this.root;
    return this.root;
  }

  public getCurr(): AlgebraNode {
    if (this.currTree === null) {
      throw new Error('Empty tree');
    }
    return this.currTree;
  }

  public addLeft(curr: AlgebraNode, type: string, value: any[]): void {
    curr.left = {
      type: type,
      value: value,
      parent: curr,
    };
  }

  public addRight(curr: AlgebraNode, type: string, value: any[]): void {
    curr.right = {
      type: type,
      value: value,
      parent: curr,
    };
  }

  public moveParent(): void {
    if (this.currTree?.parent) {
      this.currTree = this.currTree.parent;
    }
  }

  public moveLeft(): void {
    if (this.currTree?.left) {
      this.currTree = this.currTree.left;
    }
  }

  public moveRight(): void {
    if (this.currTree?.right) {
      this.currTree = this.currTree.right;
    }
  }

  public getParent(curr: AlgebraNode): AlgebraNode {
    if (curr.parent === undefined) {
      throw new Error('Parent doesnt have a parent');
    }
    return curr.parent;
  }

  public postOrder(node: AlgebraNode) {
    if (node.left) {
      this.postOrder(node.left);
    }
    if (node.right) {
      this.postOrder(node.right);
    }
    console.log(node.type, node.value);
  }

  // public addAfter(parent: AlgebraNode, type: string, value: string[]) {

  // }

  // public addRoot() {}
}
