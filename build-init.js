const fs = require('fs-extra');
const { ensureAndCopySync, ensureAndWriteJSONSync, ensureAndWriteFilesSync } = require('./utils');
const simpleGit = require('simple-git/promise')();
const markdownTitle = require('markdown-title');

function createTemplateFiles() {
  const buildTemplatesPath = `${__dirname}/templates/build`;

  ensureAndCopySync(`${buildTemplatesPath}/gitignore.tpl`, './.gitignore');
  ensureAndCopySync(`${buildTemplatesPath}/package.json`, './package.json');
  ensureAndCopySync(`${buildTemplatesPath}/.gitlab-ci.yml`, './.gitlab-ci.yml');
  ensureAndCopySync(`${buildTemplatesPath}/config.js`, './docs/.vuepress/config.js');
  ensureAndCopySync(`${buildTemplatesPath}/README.md`, './docs/README.md');
}

async function addSubmodules(modules) {
  for (const module of modules) {
    const repo = `git@projects.ronasit.com:ronas-it/docs/${module}.git`;
    const path = `./docs/${module}`;
    await simpleGit.submoduleAdd(repo, path);
  }

  const gitmodules = fs.readFileSync('./.gitmodules', 'utf-8').replace(/git@projects\.ronasit\.com:ronas-it/gm, '..');
  ensureAndWriteFilesSync('./.gitmodules', gitmodules);
}

function generateSidebar(modules) {
  const sidebar = modules.map((module) => {
    const title = markdownTitle(fs.readFileSync(`./docs/${module}/README.md`, 'utf-8'));
    return {
      title: title,
      path: `/${module}/`
    };
  });

  ensureAndWriteJSONSync('./docs/.vuepress/sidebar.json', sidebar);
}

module.exports = async function buildInit(argv) {
  const modules = argv.modules;

  createTemplateFiles();
  await addSubmodules(modules);
  generateSidebar(modules);
};
