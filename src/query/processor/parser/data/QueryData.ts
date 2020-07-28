export default class QueryData {
  private projectionList: number[];
  private selectionList: Array<any>;

  private joinList: string[];
  private tableList: number[];

  constructor(
    pList: number[],
    sList: Array<any>,
    jList: string[],
    tList: number[]
  ) {
    this.projectionList = pList;
    this.selectionList = sList;
    this.joinList = jList;
    this.tableList = tList;
  }

  public getJoinList() {
    return this.joinList;
  }

  public getTableList() {
    return this.tableList;
  }

  public getProjection() {
    return this.projectionList;
  }

  public getSelection() {
    return this.selectionList;
  }
}
