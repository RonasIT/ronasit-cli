const simpleGit = require('simple-git/promise')();
const signale = require('signale');
const fs = require('fs-extra');
const { ensureAndWriteJSONSync } = require('./utils');

async function removeSubmodule(module) {
  await simpleGit.rm(`docs/${module}`);
  fs.removeSync(`./.git/modules/docs/${module}`);

  signale.success('Submodule removed');
}

function generateSidebar(module) {
  const path = './docs/.vuepress/sidebar.json';
  const sidebar = fs.readJSONSync(path);

  const index = sidebar.findIndex((item) => item.path === `/${module}/docs/`);
  sidebar.splice(index, 1);

  ensureAndWriteJSONSync(path, sidebar);

  signale.success('Sidebar updated');
  for (const item of sidebar) {
    signale.log(item.path, '=>', item.title);
  }
}

module.exports = async function buildRemove(argv) {
  const module = argv.module;


  const status = await simpleGit.status();
  if (status.files && status.files.length > 0) {
    signale.error('Please commit your changes to proceed');
    return;
  }

  await removeSubmodule(module);
  generateSidebar(module);

  signale.success('Submodule added');
};
