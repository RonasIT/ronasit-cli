const gitconfig = require('gitconfig');
const path = require('path');
const fs = require('fs-extra');

function ensureAndCopySync(src, dest) {
    fs.ensureFileSync(dest);
    fs.copySync(src, dest);
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

function getParsedTemplate(path, variables = {}) {
    const template = fs.readFileSync(path, 'utf8');
    for (const variableName in variables) {
        file.replace(`%${variableName}%`, variables[variableName]);
    }

    return template;
}

module.exports = {
    getLocalGitConfig,
    parseSlug,
    getParsedTemplate,
    ensureAndCopySync
};