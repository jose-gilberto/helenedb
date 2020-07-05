import SymbolTableEntry from './SymbolTableEntry.interface';

interface IHash {
  [key: string]: SymbolTableEntry[];
}

export default class SymbolTable {
  private entries: IHash;

  constructor() {
    this.entries = {};
  }

  public entryExists(entryRef: string, entry: SymbolTableEntry): boolean {
    if (this.entries[entryRef] == undefined) {
      // If the entry doesnt exists
      return false;
    }

    this.entries[entryRef].forEach((e) => {
      if (
        e.scope.type == entry.scope.type &&
        e.scope.parent == entry.scope.parent &&
        e.type == entry.type
      ) {
        return true;
      }
    });

    return false;
  }

  public getEntry(entryRef: string, addr: number): SymbolTableEntry {
    return this.entries[entryRef][addr];
  }

  public lexerEntry(entryRef: string): number {
    if (this.entries[entryRef] == undefined) {
      this.entries[entryRef] = [];
    }

    // Set the entry values to default in lexer
    // In parser this values will change and maybe the entry
    // realocated
    const entry: SymbolTableEntry = {
      type: '',
      scope: {
        parent: '',
        type: 0,
      },
    };
    const len = this.entries[entryRef].push(entry);
    return len - 1;
  }
}
