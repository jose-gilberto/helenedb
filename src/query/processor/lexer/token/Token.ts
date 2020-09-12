import TokenType from './TokenType';

export default class Token {
  private tokenType: TokenType;
  private tokenValue: string | number;
  private column: number;
  private row: number;

  constructor(
    type: TokenType,
    value: string | number,
    column: number,
    row: number
  ) {
    this.tokenType = type;
    this.tokenValue = value;
    this.column = column;
    this.row = row;
  }

  public getType(): TokenType {
    return this.tokenType;
  }

  public getValue(): string | number {
    return this.tokenValue;
  }

  public getColumn(): number {
    return this.column;
  }

  public getRow(): number {
    return this.row;
  }
}
