// THIS IS FILE IS OPTIONAL, you can delete it if you don't want to use it

// config.js is the entry file for your VuePress app configuration
// It can also be written in yml or toml instead of js
// See the documentation for more information on how to use it
// https://v1.vuepress.vuejs.org/config/

module.exports = {
  title: "Coding&Life", // 左侧标题
  description: "VuePress starter template for CodeSandbox",
  themeConfig: {
    logo: "/favicon.ico", //LOGO
    // repo: '',
    // 导航标签
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Java",
        ariaLabel: "Language Menu",
        items: [{ text: "SpringBoot", link: "/springboot/" }]
      },
      { text: "Life", link: "/life/" },
      { text: "Share", link: "/share/" },
      { text: "About me", link: "/about/" }
    ],
    // 左侧菜单
    sidebar: "auto",
    sidebarDepth: 4,
    searchMaxSuggestions: 10, //  搜索结果数量
    displayAllHeaders: true, // 默认值：false
    activeHeaderLinks: true, // URL与hash值是否实时更新
    lastUpdated: "Last Updated", // 显示文章最后更新时间，基于git
    // 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
    nextLinks: true,
    // 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
    prevLinks: true,
    smoothScroll: true, // 启用滚动
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'xiaozheng243/xiaozheng243.github.io',

    docsDir: 'blog',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: '查看源码',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '帮助我们改善此页面！'
  }
};
