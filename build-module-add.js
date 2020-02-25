const signale = require('signale');
const fs = require('fs-extra');
const markdownTitle = require('markdown-title');
const { ensureAndWriteJSONSync, addSubmodule, updateGitModulesFile } = require('./utils');

function addModuleToSidebar(module) {
  const readmePath = `./docs/${module}/README.md`;
  const readmeFile = fs.readFileSync(readmePath, 'utf-8');
  const title = markdownTitle(readmeFile);

  const sidebarPath = './docs/.vuepress/sidebar.json';
  const sidebar = fs.readJSONSync(sidebarPath);
  sidebar.push({
    title: title,
    path: `/${module}/docs/`
  });

  ensureAndWriteJSONSync(sidebarPath, sidebar);

  signale.success('Sidebar updated');

  for (const item of sidebar) {
    signale.log(item.path, '=>', item.title);
  }
}

module.exports = async function buildModuleAdd(argv) {
  const module = argv.module;

  await addSubmodule(module);
  updateGitModulesFile();
  addModuleToSidebar(module);

  signale.success('Module added');
};
