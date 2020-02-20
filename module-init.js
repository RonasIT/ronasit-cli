const { getLocalGitConfig, getSlug, getParsedTemplate } = require('./utils');

const moduleTemplatesPath = `${__dirname}/templates/module`;

function createTemplateFiles() {
    ensureAndCopySync(`${moduleTemplatesPath}/.gitignore`, './.gitignore');
    ensureAndCopySync(`${moduleTemplatesPath}/.gitlab-ci.yml`, './.gitlab-ci.yml');
    ensureAndCopySync(`${moduleTemplatesPath}/package.json`, './package.json');
}

function createParsedTemplates(moduleName, slug) {
    const indexMdTemplate = getParsedTemplate(`${moduleTemplatesPath}/index.md`, {
        DOC_MODULE_NAME: moduleName
    });

    fs.ensureFileSync('./docs/index.md');
    fs.writeFileSync('./docs/index.md', indexMdTemplate);

    const docMdTempalte = getParsedTemplate(`${moduleTemplatesPath}/doc.md`, {
        DOC_MODULE_NAME: moduleName
    });

    fs.ensureFileSync(`./docs/${slug}-s-1.md`);
    fs.writeFileSync(`./docs/${slug}-s-1.md`, docMdTempalte);
}

function generateSidebar(moduleName, slug) {
    const sidebar = fs.readJSONSync(`${moduleTemplatesPath}/sidebar.json`);

    sidebar[0].title = sidebar[0].title.replace('%DOC_MODULE_NAME%', moduleName);
    sidebar[0].path = sidebar[0].path.replace('%GITLAB_PROJECT_SLUG%', slug);

    fs.ensureFileSync('./docs/.vuepress/sidebar.json');
    fs.writeJSONSync('./docs/.vuepress/sidebar.json', sidebar, { spaces: 2 });
}

function generateVuepressConfig(slug) {
    const configTemplate = getParsedTemplate(`${moduleTemplatesPath}/doc.md`, {
        GITLAB_PROJECT_SLUG: slug
    });

    fs.ensureFileSync('./docs/.vuepress/config.js');
    fs.writeFileSync('./docs/.vuepress/config.js', configTemplate);
}

module.exports = async function moduleInit(argv) {
    const localGitConfig = await getLocalGitConfig();
    const slug = getSlug(localGitConfig.remote.origin.url);
    const moduleName = argv.name;

    createTemplateFiles();
    createParsedTemplates(moduleName, slug);
    generateSidebar(moduleName, slug);
    generateVuepressConfig(slug);
};