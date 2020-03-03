const { getSidebar } = require('@ronas-it/vuepress-sidebar-generator');

module.exports = {
  base: '/%GITLAB_PROJECT_PATH%/',
  dest: 'public',
  locales: {
    '/': {
      lang: 'RU',
      title: '%DOC_MODULE_NAME%',
      description: '%DOC_MODULE_NAME%'
    },
    '/en/': {
      lang: 'EN',
      title: '%DOC_MODULE_NAME%',
      description: '%DOC_MODULE_NAME%'
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
        sidebar: getSidebar('en')
      }
    }
  }
}

