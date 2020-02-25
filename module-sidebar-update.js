const fs = require('fs-extra');
const path = require('path');
const signale = require('signale');
const markdownTitle = require('markdown-title');
const { ensureAndWriteJSONSync } = require('./utils');

module.exports = async function moduleSidebarUpdate(argv) {
    const files = fs.readdirSync('./docs/', { withFileTypes: true }).filter((file) => {
        return file.name != 'index.md' && path.extname(file.name) == '.md'
    });
    const sidebar = files.map((file) => {
        const title = markdownTitle(fs.readFileSync(`./docs/${file.name}`, 'utf-8')).replace('<DocId />', '').trim();
        const path = `/${file.name}`;
        return {
            title: title,
            path: path
        }
    });

    ensureAndWriteJSONSync('./docs/.vuepress/sidebar.json', sidebar);

    signale.success('Sidebar updated');
    for (const item of sidebar) {
        signale.log(item.path, '=>', item.title);
    }
};
