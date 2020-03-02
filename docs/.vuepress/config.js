const { getSidebar } = require('@ronas-it/vuepress-sidebar-generator');

module.exports = {
  base: '/docs-tool/',
  dest: 'public',
  locales: {
    '/': {
      lang: 'RU',
      title: 'Документация ангуляр',
      description: 'Документация ангуляр'
    },
    '/en/': {
      lang: 'EN',
      title: 'Документация ангуляр',
      description: 'Документация ангуляр'
    }
  },
  markdown: {
    extendMarkdown: (md) => {
      md.set({ html: true });
      md.use(require('markdown-it-plantuml'), {
        openMarker: '\`\`\`plantuml',
        closeMarker: '\`\`\`'
      });
    }
  },
  theme: '@ronas-it/vuepress-theme-docs',
  themeConfig: {
    logo: 'https://projects.ronasit.com/uploads/-/system/appearance/header_logo/1/logo.svg',
    isSearchByDocIdEnabled: true,
    locales: {
      '/': {
        sidebar: getSidebar()
      },
      '/en/': {
        sidebar: getSidebar()
      }
    }
  }
}

