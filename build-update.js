const { ensureAndCopySync, getLocalGitConfig, getParsedTemplate, ensureAndWriteFilesSync, parsePath } = require('./utils');
const buildTemplatesPath = `${__dirname}/templates/build`;

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

module.exports = async function buildUpdate(argv) {
  const localGitConfig = await getLocalGitConfig();
  const path = parsePath(localGitConfig.remote.origin.url);

  createTemplateFiles();
  generateVuepressConfig(path);
};
