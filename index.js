const yargs = require('yargs');
const gitconfig = require('gitconfig');
const path = require('path');
const fs = require('fs-extra');
const markdownTitle = require('markdown-title');
const simpleGit = require('simple-git')('./');

const moduleTemplatesPath = `${__dirname}/templates/module`;
const buildTemplatesPath = `${__dirname}/templates/build`;

const argv = yargs
    .usage('Usage: $0 <command> [options]')
    .command('$0', '', () => {}, (argv) => {
        console.log('Welcome to Ronas IT doc modules generator');
        console.log(`Please ${argv['$0']} --help for more details`);
    })
    .command('module:init [name]', '', (yargs) => {
        yargs.positional('name', {
            describe: 'Имя модуля',
            type: 'string',
            default: 'Новый модуль'
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

async function moduleInit(argv) { 
    const localGitConfig = await getLocalGitConfig();
    const slug = getSlug(localGitConfig.remote.origin.url);
    const moduleName = argv.name;

    fs.copySync(`${moduleTemplatesPath}/.gitignore`, './.gitignore');
    fs.copySync(`${moduleTemplatesPath}/.gitlab-ci.yml`, './.gitlab-ci.yml');
    fs.copySync(`${moduleTemplatesPath}/package.json`, './package.json');

    const indexMd = fs.readFileSync(`${moduleTemplatesPath}/index.md`, 'utf8').replace('%DOC_MODULE_NAME%', moduleName);
    fs.ensureFileSync('./docs/index.md');
    fs.writeFileSync('./docs/index.md', indexMd);

    const docMd = fs.readFileSync(`${moduleTemplatesPath}/doc.md`, 'utf8').replace('%DOC_MODULE_NAME%', moduleName);
    fs.ensureFileSync(`./docs/${slug}-s-1.md`);
    fs.writeFileSync(`./docs/${slug}-s-1.md`, docMd);

    const sidebar = fs.readJSONSync(`${moduleTemplatesPath}/sidebar.json`);
    sidebar[0].title = sidebar[0].title.replace('%DOC_MODULE_NAME%', moduleName);
    sidebar[0].path = sidebar[0].path.replace('%GITLAB_PROJECT_SLUG%', slug);
    fs.ensureFileSync('./docs/.vuepress/sidebar.json');
    fs.writeJSONSync('./docs/.vuepress/sidebar.json', sidebar, {spaces: 2});

    const config = fs.readFileSync(`${moduleTemplatesPath}/config.js`, 'utf8').replace('%GITLAB_PROJECT_SLUG%', slug);
    fs.ensureFileSync('./docs/.vuepress/config.js');
    fs.writeFileSync('./docs/.vuepress/config.js', config);
}

function moduleUpdate(argv) { 
    console.log("Run module:update")
}

function moduleSidebarUpdate(argv) { 
    console.log("Run module:sidebar-update")
}

async function buildInit(argv) { 
    const modules = argv.modules;

    fs.copySync(`${buildTemplatesPath}/.gitignore`, './.gitignore');
    fs.copySync(`${buildTemplatesPath}/package.json`, './package.json');
    fs.copySync(`${buildTemplatesPath}/.gitlab-ci.yml`, './.gitlab-ci.yml');

    fs.ensureFileSync('./docs/.vuepress/config.js');
    fs.copySync(`${buildTemplatesPath}/config.js`, './docs/.vuepress/config.js');

    fs.ensureFileSync('./docs/README.md');
    fs.copySync(`${buildTemplatesPath}/README.md`, './docs/README.md');

    for (const module of modules) {
        const repo = `git@projects.ronasit.com:ronas-it/docs/${module}.git`;
        const path = `./docs/${module}`;    
        await simpleGit.submoduleAdd(repo, path);
    }
    
    const gitmodules = fs.readFileSync('./.gitmodules', 'utf-8').replace('git@projects.ronasit.com:ronas-it', '..');
    fs.writeFileSync('./.gitmodules', gitmodules);

    const sidebar = modules.map((module) => {
        const title = markdownTitle(fs.readFileSync(`./docs/${module}/README.md`, 'utf-8'));
        return {
            title: title,
            path: `/${module}/`
        };
    });

    fs.ensureFileSync('./docs/.vuepress/sidebar.json');
    fs.writeJSONSync('./docs/.vuepress/sidebar.json', sidebar, {spaces: 2});
}

function buildUpdate(argv) { 
    console.log("Run build:update")
}

async function getLocalGitConfig() {
    try {
        const config =  await gitconfig.get({
           location: 'local'
       });
       return config;
   } catch {
       console.error("Command must be run into git-repository");
       process.exit(0);
   }
}

function getSlug(remoteURL) {
    return path.basename(remoteURL, '.git')
}