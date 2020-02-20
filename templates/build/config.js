const { getSidebar } = require('@ronas-it/vuepress-sidebar-generator');

module.exports = {
  base: '/',
  plugins: [
    [
      'vuepress-plugin-container'
    ]
  ],
  markdown: {
    extendMarkdown: (md) => {
      md.set({ html: true });
      md.use(require('markdown-it-plantuml'), {
        openMarker: '\`\`\`plantuml',
        closeMarker: '\`\`\`'
      });
    }
  },
  dest: 'public',
  theme: '@ronas-it/vuepress-theme-docs',
  themeConfig: {
    logo: 'https://projects.ronasit.com/uploads/-/system/appearance/header_logo/1/logo.svg',
    isSearchByDocIdEnabled: true,
    locales: {
      '/': {
        sidebar: getSidebar()
      }
    }
  }
}