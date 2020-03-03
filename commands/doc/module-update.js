const { getLocalGitConfig, parsePath, getParsedTemplate, ensureAndCopySync, ensureAndWriteFilesSync } = require('../../utils');
const moduleTemplatesPath = `${__dirname}/templates/module`;
const signale = require('signale');

function createTemplateFiles() {
  ensureAndCopySync(`${moduleTemplatesPath}/gitignore.tpl`, './.gitignore');
  ensureAndCopySync(`${moduleTemplatesPath}/.gitlab-ci.yml`, './.gitlab-ci.yml');
  ensureAndCopySync(`${moduleTemplatesPath}/package.json`, './package.json');
}

function generateVuepressConfig(path) {
  const configTemplate = getParsedTemplate(`${moduleTemplatesPath}/config.js`, {
    GITLAB_PROJECT_PATH: path
  });
  ensureAndWriteFilesSync('./docs/.vuepress/config.js', configTemplate);
}

module.exports = async function moduleUpdate(argv) {
  const localGitConfig = await getLocalGitConfig();
  const path = parsePath(localGitConfig.remote.origin.url);
  createTemplateFiles();
  generateVuepressConfig(path);
  signale.success('Module updated');
};
