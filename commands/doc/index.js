const buildInit = require('./build-init');
const buildUpdate = require('./build-update');
const moduleInit = require('./module-init');
const moduleTechInit = require('./module-tech-init');
const moduleUpdate = require('./module-update');
const moduleSidebarUpdate = require('./module-sidebar-update');
const docCreate = require('./doc-create');
const buildModuleAdd = require('./build-module-add');
const buildModuleRemove = require('./build-module-remove');

module.exports = function (yargs) {
  yargs.command('module:init [name]', '', (yargs) => {
      yargs.positional('name', {
        describe: 'Name of the module',
        type: 'string',
        default: 'New module'
      })
    }, (argv) => {
      if (!!argv.tech) {
        moduleTechInit(argv);
      } else {
        moduleInit(argv);
      }
    })
    .example('$0 doc module:init Staff', 'Create module')
    .example('$0 doc module:init Angular --tech', 'Create tech module')
    .command('module:update', '', {}, moduleUpdate)
    .example('$0 doc module:update', 'Update module')
    .command('module:sidebar-update', '', {}, moduleSidebarUpdate)
    .example('$0 doc module:sidebar-update', 'Update module\'s sidebar')
    .command('build:init <modules..>', '', (yargs) => {
      yargs.positional('modules', {
        describe: 'List of modules',
        type: 'array'
      })
    }, buildInit)
    .example('$0 doc build:init module1 module2', 'Create build from modules')
    .command('build:update', '', {}, buildUpdate)
    .example('$0 doc build:update', 'Update build')
    .command('create [type] [title]', '', (yargs) => {
      yargs.positional('type', {
        describe: 'Type of doc',
        type: 'string',
        choices: ['strategy', 'execution', 'control', 'instruction']
      }).positional('name', {
        describe: 'Title of doc',
        type: 'string'
      })
    }, docCreate)
    .example('$0 doc create strategy "Strategy"', 'Create strategy')
    .example('$0 doc create execution "Execution"', 'Create execution')
    .example('$0 doc create control "Control"', 'Create control')
    .example('$0 doc create instruction "Instruction"', 'Create instruction')
    .command('build:module:add <module>', '', (yargs) => {
      yargs.positional('module', {
        describe: 'Name of the module',
        type: 'string'
      })
    }, buildModuleAdd)
    .example('$0 doc build:module:add doc', 'Add doc module')
    .command('build:module:remove <module>', '', (yargs) => {
      yargs.positional('module', {
        describe: 'Name of the module',
        type: 'string'
      })
    }, buildModuleRemove)
    .example('$0 doc build:module:remove doc', 'Remove doc module');
}
