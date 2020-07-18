import SymbolTableEntry from './SymbolTableEntry.interface';

interface IHash {
  [key: number]: SymbolTableEntry;
}

export default class SymbolTable {
  private entries: IHash;
  private lastAddress: number;

  constructor() {
    this.entries = {};
    this.lastAddress = 0;
  }

  public entryExists(entry: SymbolTableEntry): number {
    for (const key in this.entries) {
      if (
        this.entries[Number(key)].name == entry.name &&
        this.entries[Number(key)].scope.type == entry.scope.type &&
        this.entries[Number(key)].scope.parent == entry.scope.parent &&
        this.entries[Number(key)].type == entry.type
      ) {
        return Number(key);
      }
    }

    return -1;
  }

  public getEntry(addr: number): SymbolTableEntry {
    return this.entries[addr];
  }

  public add(entry: SymbolTableEntry): number {
    if (this.entryExists(entry) !== -1) {
      return this.entryExists(entry);
    }

    const addr = this.lastAddress + 1;
    this.entries[addr] = entry;
    this.lastAddress = addr;
    return addr;
  }
}
