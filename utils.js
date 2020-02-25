const gitconfig = require('gitconfig');
const path = require('path');
const fs = require('fs-extra');
const signale = require('signale');
const simpleGit = require('simple-git/promise')();

function ensureAndCopySync(src, dest) {
  fs.ensureFileSync(dest);
  fs.copySync(src, dest);
}

function ensureAndWriteJSONSync(path, json) {
  fs.ensureFileSync(path);
  fs.writeJSONSync(path, json, { spaces: 2 });
}

function ensureAndWriteFilesSync(path, content) {
  fs.ensureFileSync(path);
  fs.writeFileSync(path, content);
}

async function getLocalGitConfig() {
  try {
    const config = await gitconfig.get({
      location: 'local'
    });

    return config;
  } catch {
    console.error('Command must be run into git-repository');
    process.exit(0);
  }
}

function parseSlug(remoteURL) {
  return path.basename(remoteURL, '.git');
}

function parsePath(remoteURL) {
  return remoteURL.match(/\/(.*)\.git/)[1];
}

function getParsedTemplate(path, variables = {}) {
  var template = fs.readFileSync(path, 'utf8');
  for (const variableName in variables) {
    template = template.replace(`%${variableName}%`, variables[variableName]);
  }

  return template;
}

async function updateGitModulesFile() {
  const gitmodules = fs.readFileSync('./.gitmodules', 'utf-8').replace(/git@projects\.ronasit\.com:ronas-it/gm, '../..');
  ensureAndWriteFilesSync('./.gitmodules', gitmodules);
}

async function addSubmodule(module) {
  const repo = `git@projects.ronasit.com:ronas-it/docs/${module}.git`;
  const path = `./docs/${module}`;

  await simpleGit.submoduleAdd(repo, path);
  signale.success('Submodule added', '=>', repo);
}

async function removeSubmodule(module) {
  await simpleGit.rm(`docs/${module}`);
  fs.removeSync(`./.git/modules/docs/${module}`);

  signale.success('Submodule removed');
}

module.exports = {
  getLocalGitConfig,
  parseSlug,
  parsePath,
  getParsedTemplate,
  ensureAndCopySync,
  ensureAndWriteJSONSync,
  ensureAndWriteFilesSync,
  updateGitModulesFile,
  addSubmodule,
  removeSubmodule
};
