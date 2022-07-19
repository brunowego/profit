const { Command } = require('commander');
const program = new Command();

program
  .name('profit')
  .description('Never miss a trade opportunity again.')
  .version('0.0.0');

const watch = program
  .command('watch')
  .description('Watch TradingView indicators')

const rsi = watch
  .command('rsi')
  .description('Watch oversold and overbought from Relative Strength Index')

rsi
  .command('list')
  .description('Lists all symbols that will be watched')
  .action(() => console.log('TODO'))

rsi
  .command('add')
  .description('Add new symbol to watch')
  .action(() => console.log('TODO'))

rsi
  .command('remove')
  .description('Remove a specific symbol from the list')
  .action(() => console.log('TODO'))

rsi
  .command('prune')
  .description('Removes all symbols from the watch list')
  .action(() => console.log('TODO'))

program.parse(process.argv)
