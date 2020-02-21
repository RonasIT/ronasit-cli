#!/usr/bin/env node

const yargs = require('yargs');

const buildInit = require('./build-init');
const buildUpdate = require('./build-update');
const moduleInit = require('./module-init');
const moduleUpdate = require('./module-update');
const moduleSidebarUpdate = require('./module-sidebar-update');

yargs
  .usage('Usage: $0 <command> [options]')
  .command('$0', '', () => { }, (argv) => {
    console.log('Welcome to Ronas IT docs tool');
    console.log(`Please ${argv['$0']} --help for more details`);
  })
  .command('module:init [name]', '', (yargs) => {
    yargs.positional('name', {
      describe: 'Name of the module',
      type: 'string',
      default: 'New module'
    })
  }, moduleInit)
  .example('$0 module:init Staff', 'Create module')
  .command('module:update', '', {}, moduleUpdate)
  .example('$0 module:update', 'Update module')
  .command('module:sidebar-update', '', {}, moduleSidebarUpdate)
  .example('$0 module:sidebar-update', 'Update module\'s sidebar')
  .command('build:init <modules..>', '', (yargs) => {
    yargs.positional('modules', {
      describe: 'Список модулей',
      type: 'array'
    })
  }, buildInit)
  .example('$0 build:init module1 module2', 'Create build from modules')
  .command('build:update', '', {}, buildUpdate)
  .example('$0 build:update', 'Update build')
  .help('h')
  .alias('h', 'help')
  .epilog('Ronas IT 2020')
  .locale('en')
  .argv;
