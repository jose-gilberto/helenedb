import * as readline from 'readline';
import Lexer from '../query/processor/lexer/Lexer';

enum MetaCommand {
  EXIT,
  UNRECOGNIZED,
}

export default class ConsoleInterpreter {
  private doMetaCommand(cmd: string): MetaCommand {
    if (cmd === '.exit') {
      process.exit(MetaCommand.EXIT);
    } else {
      return MetaCommand.UNRECOGNIZED;
    }
  }

  public start(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.setPrompt('helenedb> ');
    rl.prompt();

    rl.on('line', (line) => {
      if (line[0] === '.') {
        switch (this.doMetaCommand(line)) {
          case MetaCommand.UNRECOGNIZED:
            console.log(`Unrecognized command ${line}. \n`);
            break;
        }
      } else {
        const lexer = new Lexer();
        const tokens = lexer.start(line);
        console.log(tokens);
      }
      rl.prompt();
    }).on('close', function () {
      process.exit(0);
    });
  }
}
