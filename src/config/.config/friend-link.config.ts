// 🕊️白木 原创开发 🔗gl.baimu.live
// 🔗 友链页面用户自定义配置

import type { FriendLinkConfig } from '../friend-link.config';

// ========================================
// 📝 用户自定义配置
// 这里的配置会覆盖默认配置
// ========================================
export const userFriendLinkConfig: Partial<FriendLinkConfig> = {
  // 页面主标题
  title: '💫 RouxZhee 友链页面 🚀',

  // Banner 配置
  banner: {
    show: true,
    smallTitle: '让你我与各位博主一起成长进步',
    showButtonGroup: true,
  },

  // 友链分组列表
  // 继续往 groups 数组追加即可新增分组
  groups: [
    {
      title: '✨ RouxZhee 主创团队',
      subtitle: 'RouxZhee Core creative team',
      desc: '把血泪教训做成博客，只为让后来的你，少熬一个夜',
      list: [
        {
          name: '余温',
          tag: '后端开发/功能',
          link: 'https://wiki.xxdevops.cn/',
          avatar: 'https://img.xxdevops.cn/blog/avatar/yuwen_avatar.avif',
          descr: '源于热爱，而去创造',
          irregular: false,
        },
        {
          name: '🗼白木',
          tag: 'UI开发/框架',
          link: 'https://gl.baimu.live/',
          avatar: 'https://mu.baimu.live/a/img/gura-touxiang-1.png',
          descr: '打不过 我可以Alt+F4的～',
          irregular: false,
        },
      ],
    },
    {
      title: '🎉 RouxZhee 嘉宾',
      subtitle: 'RouxZhee Special Guest',
      desc: '聚集众多优秀独立博客，RouxZhee生态有他们得以追求更加向往的轻压/丝滑响应 🚀',
      list: [
        {
          name: 'Teek - 本站点主题作者',
          tag: 'teek主题',
          link: 'https://notes.teek.top/',
          avatar: 'https://mu.baimu.live/a/img/teek/teek-tx.jpg',
          descr: '朝圣的使徒，正在走向编程的至高殿堂！',
          irregular: false,
        },
        {
          name: 'W3C技术联盟博客',
          tag: '专注web',
          link: 'https://blog.w3c.cool',
          avatar: 'https://blog.w3c.cool/img/built/ADlXV04Q44-360.avif',
          descr: '专注于一系列深受web影响的行业生态',
          irregular: false,
        },
        {
          name: 'One Blog',
          tag: '执着博客的博主',
          link: 'https://onedayxyy.cn/',
          avatar: 'https://onedayxyy.cn/favicon.ico',
          descr: '明心静性，爱自己',
          irregular: false,
        },
        {
          name: '威威 Blog',
          tag: '精美的teek主题',
          link: 'https://dl-web.top/',
          avatar: 'https://dl-web.top/avatar/avatar.svg',
          descr: '一名兴趣使然的程序员，个人博客，全栈分享',
          irregular: false,
        },
        {
          name: 'Hyde Blog',
          tag: '更多Teek扩展与美化',
          link: 'https://teek.seasir.top/',
          avatar: 'https://teek.seasir.top/favicon.ico',
          descr: '人心中的成见是一座大山',
          irregular: false,
        },
        {
          name: '时光笔记',
          tag: '友链页面作者',
          link: 'https://kandu.cxcare.top/',
          avatar: 'https://kandu.cxcare.top/logo.svg',
          descr: '干货满满的技术笔记',
          irregular: true,
        },
        {
          name: '心流笔记',
          tag: 'Teek博主之一',
          link: 'http://blog.wilsonzy.cn/c/StreamNotes/',
          avatar: 'http://blog.wilsonzy.cn/c/StreamNotes/favicon.ico',
          descr: '坚持 & 汲取 & 分享 ✨一个记录生活与学习过程中灵感和感悟的空间',
          irregular: false,
        },
      ],
    },
  ],
};

export default userFriendLinkConfig;
