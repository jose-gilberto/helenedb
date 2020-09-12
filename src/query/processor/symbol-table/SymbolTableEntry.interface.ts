enum ScopeType {
  GLOBAL,
  LOCAL,
  CUSTOM,
}

export default interface SymbolTableEntry {
  name: string;
  scope: {
    type: ScopeType;
    parent: number;
  };
  type: string;
}
