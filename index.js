#!/usr/bin/env node

const yargs = require('yargs');
const docCommand =  require('./commands/doc');

yargs
  .usage('Usage: $0 <command> [options]')
  .command('$0', '', () => { }, (argv) => {
    console.log('Welcome to Ronas IT cli tool');
    console.log(`Please use ${argv['$0']} --help for more details`);
  })
  .command('doc', '', docCommand)
  .help('h')
  .alias('h', 'help')
  .epilog('Ronas IT 2020')
  .wrap(100)
  .locale('en')
  .argv;
