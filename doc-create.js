const fs = require('fs-extra');
const signale = require('signale');
const { ensureAndWriteFilesSync, getLocalGitConfig, parseSlug } = require('./utils');
const moduleSidebarUpdate = require('./module-sidebar-update');
const shortTypes = {
  strategy: 's',
  execution: 'e',
  control: 'c',
  instruction: 'i'
};

function getNextIndex(pattern) {
  var maxIndex = 0;
  const files = fs.readdirSync('./docs/', { withFileTypes: true });

  for (file of files) {
    const item = file.name.match(pattern);
    if (item !== null) {
      const currentIndex = parseInt(item[1], 10);
      maxIndex = (maxIndex < currentIndex) ? currentIndex : maxIndex
    }
  }

  return (maxIndex + 1);
}

module.exports = async function moduleInit(argv) {
  const type = shortTypes[argv.type];
  const title = argv.title;
  const localGitConfig = await getLocalGitConfig();
  const slug = parseSlug(localGitConfig.remote.origin.url);
  const pattern = new RegExp(`^${slug}-${type}-(\\d+)\\.md$`);
  const index = getNextIndex(pattern);
  const path = `./docs/${slug}-${type}-${index}.md`;

  ensureAndWriteFilesSync(path, `# ${title} <DocId />\n`);

  signale.success('Document created');
  signale.log(path);

  moduleSidebarUpdate();
};
