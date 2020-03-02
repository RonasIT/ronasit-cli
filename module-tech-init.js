const fs = require('fs-extra');
const signale = require('signale');
const { getLocalGitConfig, getParsedTemplate, parsePath, parseSlug, ensureAndCopySync, ensureAndWriteFilesSync } = require('./utils');

const moduleTemplatesPath = `${__dirname}/templates/module`;
const moduleTechTemplatesPath = `${__dirname}/templates/module-tech`;

function createTemplateFiles() {
  ensureAndCopySync(`${moduleTemplatesPath}/gitignore.tpl`, './.gitignore');
  ensureAndCopySync(`${moduleTemplatesPath}/.gitlab-ci.yml`, './.gitlab-ci.yml');
  ensureAndCopySync(`${moduleTemplatesPath}/package.json`, './package.json');
}

function generateVuepressConfig(path, moduleName) {
  const configTemplate = getParsedTemplate(`${moduleTechTemplatesPath}/config.js`, {
    GITLAB_PROJECT_PATH: path,
    DOC_MODULE_NAME: moduleName
  });
  ensureAndWriteFilesSync('./docs/.vuepress/config.js', configTemplate);
}

function generateSidebar() {
  ensureAndCopySync(`${moduleTechTemplatesPath}/sidebar.json`, './docs/.vuepress/sidebar.json');
  ensureAndCopySync(`${moduleTechTemplatesPath}/sidebar.en.json`, './docs/.vuepress/sidebar.en.json');
}

function createDocs() {
  ensureAndCopySync(`${moduleTechTemplatesPath}/docs`, './docs');
}

function createParsedTemplates(moduleName) {
  const indexMdTemplate = getParsedTemplate(`${moduleTechTemplatesPath}/index.md`, {
    DOC_MODULE_NAME: moduleName
  });
  ensureAndWriteFilesSync('./docs/index.md', indexMdTemplate);
  ensureAndWriteFilesSync('./docs/en/index.md', indexMdTemplate);
}

module.exports = async function moduleInit(argv) {
  const localGitConfig = await getLocalGitConfig();
  const slug = parseSlug(localGitConfig.remote.origin.url);
  const path = parsePath(localGitConfig.remote.origin.url);
  const moduleName = argv.name;

  createTemplateFiles();
  createDocs();
  createParsedTemplates(moduleName);
  generateVuepressConfig(path, moduleName);
  generateSidebar();

  signale.success('Module initialized');
};
