const simpleGit = require('simple-git/promise')();
const signale = require('signale');
const fs = require('fs-extra');
const { ensureAndWriteJSONSync, removeSubmodule } = require('./utils');

function removeModuleFromSidebar(module) {
  const sidebarPath = './docs/.vuepress/sidebar.json';
  const sidebar = fs.readJSONSync(sidebarPath);

  const index = sidebar.findIndex((item) => item.path === `/${module}/docs/`);
  sidebar.splice(index, 1);

  ensureAndWriteJSONSync(sidebarPath, sidebar);

  signale.success('Sidebar updated');
  for (const item of sidebar) {
    signale.log(item.path, '=>', item.title);
  }
}

module.exports = async function buildModuleRemove(argv) {
  const status = await simpleGit.status();
  const isUncommitedFilesExist = status.files && status.files.length > 0;
  if (isUncommitedFilesExist) {
    signale.error('Please commit your changes to proceed');
    return;
  }

  const module = argv.module;

  await removeSubmodule(module);
  removeModuleFromSidebar(module);

  signale.success('Module removed');
};
