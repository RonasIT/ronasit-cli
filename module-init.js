const fs = require('fs-extra');
const { getLocalGitConfig, parseSlug, getParsedTemplate, ensureAndCopySync, ensureAndWriteJSONSync, ensureAndWriteFilesSync } = require('./utils');

const moduleTemplatesPath = `${__dirname}/templates/module`;

function createTemplateFiles() {
  ensureAndCopySync(`${moduleTemplatesPath}/gitignore.tpl`, './.gitignore');
  ensureAndCopySync(`${moduleTemplatesPath}/.gitlab-ci.yml`, './.gitlab-ci.yml');
  ensureAndCopySync(`${moduleTemplatesPath}/package.json`, './package.json');
}

function createParsedTemplates(moduleName, slug) {
  const indexMdTemplate = getParsedTemplate(`${moduleTemplatesPath}/index.md`, {
    DOC_MODULE_NAME: moduleName
  });
  ensureAndWriteFilesSync('./docs/index.md', indexMdTemplate);

  const docMdTempalte = getParsedTemplate(`${moduleTemplatesPath}/doc.md`, {
    DOC_MODULE_NAME: moduleName
  });
  ensureAndWriteFilesSync(`./docs/${slug}-s-1.md`, docMdTempalte);
}

function generateSidebar(moduleName, slug) {
  const sidebar = fs.readJSONSync(`${moduleTemplatesPath}/sidebar.json`);

  sidebar[0].title = sidebar[0].title.replace('%DOC_MODULE_NAME%', moduleName);
  sidebar[0].path = sidebar[0].path.replace('%GITLAB_PROJECT_SLUG%', slug);

  ensureAndWriteJSONSync('./docs/.vuepress/sidebar.json', sidebar);
}

function generateVuepressConfig(slug) {
  const configTemplate = getParsedTemplate(`${moduleTemplatesPath}/config.js`, {
    GITLAB_PROJECT_SLUG: slug
  });
  ensureAndWriteFilesSync('./docs/.vuepress/config.js', configTemplate);
}

module.exports = async function moduleInit(argv) {
  const localGitConfig = await getLocalGitConfig();
  const slug = parseSlug(localGitConfig.remote.origin.url);
  const moduleName = argv.name;

  createTemplateFiles();
  createParsedTemplates(moduleName, slug);
  generateSidebar(moduleName, slug);
  generateVuepressConfig(slug);
};
