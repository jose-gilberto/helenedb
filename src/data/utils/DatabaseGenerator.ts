import path from 'path';
import fs from 'fs';
import FileManager from '../file/FileManager';

export default class DatabaseGenerator {
  public static readonly DB_VERSION = '0.1.1';

  // public static encrypt(data: string): string {
  //   return data;
  // }

  public static delete(dir: string): void {
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach((file) => {
        const curPath = path.join(dir, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          // recurse
          DatabaseGenerator.delete(curPath);
        } else {
          // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(dir);
    }
  }

  // eslint-disable-next-line no-use-before-define
  public static create(
    dir: string,
    structure: { [key: string]: any },
    cb: any = null
  ): void {
    // eslint-disable-next-line no-use-before-define
    cb = ((cb) => (...a: any) => setTimeout(() => cb(...a)))(cb);
    const subdirs = Reflect.ownKeys(structure);

    if (subdirs.length) {
      const sub = subdirs[0].toString();
      const pth = path.join(dir, sub);

      const subsub = structure[sub];
      const copy = Object.assign({}, structure);
      delete copy[sub];

      fs.mkdir(pth, (err) => {
        if (err) return cb(err);
        this.create(pth, subsub, (err: any) => {
          if (err) return cb(err);
          this.create(dir, copy, cb);
        });
      });
    } else {
      cb(null);
    }
  }

  public static generateFiles(): void {
    let stream: fs.WriteStream;

    // Generate the main file containing the number of the version
    stream = fs.createWriteStream(
      path.resolve(FileManager.FILES_DIR, 'HELENEDB_VERSION')
    );
    stream.once('open', () => {
      stream.write(`VERSION=${DatabaseGenerator.DB_VERSION}`, 'base64');
      stream.end();
    });

    /**
     * Generate the main directories each one contains
     * global
     * base - for each database the dbms creates one folder in base
     * base/public - default database
     * t_log
     * t-state
     * wal_log
     */
    DatabaseGenerator.create(
      FileManager.FILES_DIR,
      {
        global: {},
        base: {
          public: {},
        },
        t_log: {},
        t_state: {},
        wal_log: {},
      },
      (err: any) => {
        if (err) console.error(err);
      }
    );

    // Create the file with last command-line options
    stream = fs.createWriteStream(
      path.resolve(FileManager.FILES_DIR, 'master.opts')
    );
    stream.once('open', () => {
      stream.write(``, 'base64');
      stream.end();
    });
  }
}
