const fs = require('fs-extra');
const { ensureAndWriteFilesSync, getLocalGitConfig, parseSlug } = require('./utils');

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
  const type = argv.type;
  const title = argv.title;
  const localGitConfig = await getLocalGitConfig();
  const slug = parseSlug(localGitConfig.remote.origin.url);

  var path = "";
  var index = "";

  switch (type) {
    case 'strategy':
      index = getNextIndex(/^doc-s-(\d+)\.md$/);
      path = `./docs/${slug}-s-${index}.md`;
      break;
    case 'execution':
      index = getNextIndex(/^doc-e-(\d+)\.md$/);
      path = `./docs/${slug}-e-${index}.md`;
      break;
    case 'control':
      index = getNextIndex(/^doc-c-(\d+)\.md$/);
      path = `./docs/${slug}-c-${index}.md`;
      break;
    case 'instruction':
      index = getNextIndex(/^doc-i-(\d+)\.md$/);
      path = `./docs/${slug}-i-${index}.md`;
      break;
  }

  ensureAndWriteFilesSync(path, `# ${title}\n`);
  console.log(path)
};
