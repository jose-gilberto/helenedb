import * as fs from 'fs';
import * as path from 'path';
import DatabaseGenerator from '../utils/DatabaseGenerator';

export default class FileManager {
  // TODO: implements logger
  // private static logger: Logger = ...

  // private dbDirectory: File
  // private logDirectory: File

  public static readonly FILES_DIR: string = path.resolve(
    process.cwd(),
    '.dbfiles/'
  );
  // private static readonly LOGS_DIR: string

  constructor() {
    // fs.existsSync(`${path.dirname}`)
    // TODO: do this with async methods
    const dbExists = fs.existsSync(path.resolve(process.cwd(), '.dbfiles/'));
    if (dbExists) {
      console.log('Already exists');
    } else {
      fs.mkdirSync(path.resolve(process.cwd(), '.dbfiles/'));
      // DatabaseGenerator.generateFiles();
    }
  }
}
