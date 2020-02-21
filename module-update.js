const { getLocalGitConfig, parseSlug, getParsedTemplate, ensureAndCopySync, ensureAndWriteFilesSync } = require('./utils');
const moduleTemplatesPath = `${__dirname}/templates/module`;

function createTemplateFiles() {
  ensureAndCopySync(`${moduleTemplatesPath}/gitignore.tpl`, './.gitignore');
  ensureAndCopySync(`${moduleTemplatesPath}/.gitlab-ci.yml`, './.gitlab-ci.yml');
  ensureAndCopySync(`${moduleTemplatesPath}/package.json`, './package.json');
}

function generateVuepressConfig(slug) {
  const configTemplate = getParsedTemplate(`${moduleTemplatesPath}/config.js`, {
    GITLAB_PROJECT_SLUG: slug
  });
  ensureAndWriteFilesSync('./docs/.vuepress/config.js', configTemplate);
}

module.exports = async function moduleUpdate(argv) {
  const localGitConfig = await getLocalGitConfig();
  const slug = parseSlug(localGitConfig.remote.origin.url);
  createTemplateFiles();
  generateVuepressConfig(slug);
};
