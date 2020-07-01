enum ScopeType {
  GLOBAL,
  LOCAL,
  CUSTOM,
}

export default interface SymbolTableEntry {
  scope: {
    type: ScopeType;
    parent: string;
  };
  type: string;
}
