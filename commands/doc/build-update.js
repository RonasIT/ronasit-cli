const { ensureAndCopySync, getLocalGitConfig, getParsedTemplate, ensureAndWriteFilesSync, parsePath, updateGitModulesFile } = require('../../utils');
const buildTemplatesPath = `${__dirname}/templates/build`;
const signale = require('signale');
const simpleGit = require('simple-git/promise')();

function generateVuepressConfig(path) {
  const configTemplate = getParsedTemplate(`${buildTemplatesPath}/config.js`, {
    GITLAB_PROJECT_PATH: path
  });
  ensureAndWriteFilesSync('./docs/.vuepress/config.js', configTemplate);
}

function createTemplateFiles() {
  ensureAndCopySync(`${buildTemplatesPath}/gitignore.tpl`, './.gitignore');
  ensureAndCopySync(`${buildTemplatesPath}/package.json`, './package.json');
  ensureAndCopySync(`${buildTemplatesPath}/.gitlab-ci.yml`, './.gitlab-ci.yml');
}

async function updateSubmodules() {
  await simpleGit.submoduleUpdate(['--remote']);
  updateGitModulesFile();

  signale.success('Submodules updated');
}

module.exports = async function buildUpdate(argv) {
  const localGitConfig = await getLocalGitConfig();
  const path = parsePath(localGitConfig.remote.origin.url);

  await updateSubmodules();
  createTemplateFiles();
  generateVuepressConfig(path);

  signale.success('Build updated');
};
