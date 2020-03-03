const fs = require('fs-extra');
const signale = require('signale');
const { getLocalGitConfig, getParsedTemplate, parsePath, parseSlug, ensureAndCopySync, ensureAndWriteFilesSync } = require('../../utils');

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

function generateSidebar(slug) {
  const sidebar = getParsedTemplate(`${moduleTechTemplatesPath}/sidebar.json`, {
    GITLAB_PROJECT_SLUG: slug
  });
  const sidebarEn = getParsedTemplate(`${moduleTechTemplatesPath}/sidebar.en.json`, {
    GITLAB_PROJECT_SLUG: slug
  });
  ensureAndWriteFilesSync('./docs/.vuepress/sidebar.json', sidebar);
  ensureAndWriteFilesSync('./docs/.vuepress/sidebar.en.json', sidebarEn);
}

function renameFilesInDir(dir, slug) {
  fs.readdirSync(dir).map((item) => {
    const path = `${dir}/${item}`;
    if (fs.lstatSync(path).isFile()) {
      const newPath = `${dir}/${slug}-${item}`;
      fs.renameSync(path, newPath);
    }
  });
}

function createDocs(slug) {
  fs.removeSync('./docs');
  ensureAndCopySync(`${moduleTechTemplatesPath}/docs`, './docs');
  renameFilesInDir('./docs', slug)
  renameFilesInDir('./docs/en', slug)
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
  createDocs(slug);
  createParsedTemplates(moduleName);
  generateVuepressConfig(path, moduleName);
  generateSidebar(slug);

  signale.success('Module initialized');
};
