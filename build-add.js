const simpleGit = require('simple-git/promise')();
const signale = require('signale');
const fs = require('fs-extra');
const markdownTitle = require('markdown-title');
const { ensureAndWriteJSONSync } = require('./utils');
const path = require('path');

async function addSubmodule(module) {
  const repo = `git@projects.ronasit.com:ronas-it/docs/${module}.git`;
  const path = `./docs/${module}`;
  await simpleGit.submoduleAdd(repo, path);

  signale.success('Submodule added', '=>', repo);
}

function generateSidebar(modules) {
  const sidebar = modules.map((module) => {
    const title = markdownTitle(fs.readFileSync(`./docs/${module}/README.md`, 'utf-8'));
    return {
      title: title,
      path: `/${module}/docs/`
    };
  });

  ensureAndWriteJSONSync('./docs/.vuepress/sidebar.json', sidebar);

  signale.success('Sidebar updated');
  for (const item of sidebar) {
    signale.log(item.path, '=>', item.title);
  }
}

function generateSidebar(module) {
  const title = markdownTitle(fs.readFileSync(`./docs/${module}/README.md`, 'utf-8'));
  const newSidebarItem = {
    title: title,
    path: `/${module}/docs/`
  };

  const path = './docs/.vuepress/sidebar.json';
  const sidebar = fs.readJSONSync(path);
  sidebar.push(newSidebarItem);

  ensureAndWriteJSONSync(path, sidebar);

  signale.success('Sidebar updated');
  for (const item of sidebar) {
    signale.log(item.path, '=>', item.title);
  }
}

module.exports = async function buildAdd(argv) {
  const module = argv.module;

  await addSubmodule(module);
  generateSidebar(module);

  signale.success('Module was added to the build');
};
