import TokenType from './TokenType';

export default class Token {
  private tokenType: TokenType;
  private tokenValue: string | number;

  constructor(type: TokenType, value: string | number) {
    this.tokenType = type;
    this.tokenValue = value;
  }

  public getType(): TokenType {
    return this.tokenType;
  }

  public getValue(): string | number {
    return this.tokenValue;
  }
}
