const fs = require('fs-extra');
const {
  getLocalGitConfig,
  getParsedTemplate,
  parsePath,
  ensureAndCopySync,
  ensureAndWriteJSONSync,
  ensureAndWriteFilesSync,
  addSubmodule,
  updateGitModulesFile
} = require('./utils');
const markdownTitle = require('markdown-title');
const buildTemplatesPath = `${__dirname}/templates/build`;
const signale = require('signale');

function createTemplateFiles() {
  ensureAndCopySync(`${buildTemplatesPath}/gitignore.tpl`, './.gitignore');
  ensureAndCopySync(`${buildTemplatesPath}/package.json`, './package.json');
  ensureAndCopySync(`${buildTemplatesPath}/.gitlab-ci.yml`, './.gitlab-ci.yml');
  ensureAndCopySync(`${buildTemplatesPath}/README.md`, './docs/README.md');
}

async function addSubmodules(modules) {
  for (const module of modules) {
    await addSubmodule(module);
  }

  updateGitModulesFile();
}

function generateSidebar(modules) {
  const sidebar = modules.map((module) => {
    const title = markdownTitle(fs.readFileSync(`./docs/${module}/README.md`, 'utf-8'));
    return {
      title: title,
      path: `/${module}/docs/`
    };
  });

  ensureAndWriteJSONSync('./docs/.vuepress/sidebar.json', sidebar);

  signale.success('Sidebar updated');
  for (const item of sidebar) {
    signale.log(item.path, '=>', item.title);
  }
}

function generateVuepressConfig(path) {
  const configTemplate = getParsedTemplate(`${buildTemplatesPath}/config.js`, {
    GITLAB_PROJECT_PATH: path
  });
  ensureAndWriteFilesSync('./docs/.vuepress/config.js', configTemplate);
}

module.exports = async function buildInit(argv) {
  const modules = argv.modules;
  const localGitConfig = await getLocalGitConfig();
  const path = parsePath(localGitConfig.remote.origin.url);

  createTemplateFiles();
  await addSubmodules(modules);
  generateSidebar(modules);
  generateVuepressConfig(path);
  signale.success('Build initialized');
};
