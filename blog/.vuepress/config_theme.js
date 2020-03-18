// THIS IS FILE IS OPTIONAL, you can delete it if you don't want to use it

// config.js is the entry file for your VuePress app configuration
// It can also be written in yml or toml instead of js
// See the documentation for more information on how to use it
// https://v1.vuepress.vuejs.org/config/

module.exports = {
  title: "Coding&Life", // 左侧标题
  description: "VuePress starter template for CodeSandbox",
  theme: '@vuepress/theme-blog', // 主题名称
  themeConfig: {
    dateFormat: 'YYYY-MM-DD HH:MM', //日期格式化
    smoothScroll: true,
    nav: [
      {
        text: 'Blog',
        link: '/',
      },
      {
        text: 'Tags',
        link: '/tag/',
      },
    ],
    prevText: '上一頁', // Text for previous links.
    nextText: '下一頁', // Text for next links.
    lengthPerPage: '2', // Maximum number of posts per page.
    layout: 'Pagination', // Layout for pagination page
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/vuejs/vuepress',
        },
        {
          type: 'twitter',
          link: 'https://github.com/vuejs/vuepress',
        },
      ],
    },
    copyright: [
      {
        text: 'Privacy Policy',
        link: 'https://policies.google.com/privacy?hl=en-US',
      },
      {
        text: 'MIT Licensed | Copyright © 2018-present Vue.js',
        link: '',
      },
    ],

  }
};
