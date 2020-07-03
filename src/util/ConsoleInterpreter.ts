import * as readline from 'readline';

export default class ConsoleInterpreter {
  public static start(): void {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.setPrompt('helenedb> ');
    rl.prompt();

    rl.on('line', (line) => {
      if (line === '.exit') rl.close();
      else {
        console.log(`Unrecognized command ${line}. \n`);
      }
      rl.prompt();
    }).on('close', function () {
      process.exit(0);
    });
  }
}
