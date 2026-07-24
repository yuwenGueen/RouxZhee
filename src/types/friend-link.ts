// 🕊️白木 原创开发 🔗gl.baimu.live
// 🔗 友链页面类型定义

/** 单个友链信息 */
export interface FriendLinkItem {
  /** 友链名称 */
  name: string;
  /** 友链地址 */
  link: string;
  /** 友链头像/Logo */
  avatar?: string;
  /** 友链描述 */
  descr?: string;
  /** 友链标签（可选） */
  tag?: string;
  /** 是否为不规则头像（非圆形） */
  irregular?: boolean;
}

/** 友链分组 */
export interface FriendLinkGroup {
  /** 分组标题 */
  title: string;
  /** 分组副标题（装饰标题下方的英文/小字） */
  subtitle?: string;
  /** 分组描述 */
  desc: string;
  /** 该分组下的友链列表 */
  list: FriendLinkItem[];
}

/** 友链 Banner 配置 */
export interface FriendLinkBanner {
  /** 是否显示 Banner */
  show: boolean;
  /** 左上角小标题 */
  smallTitle: string;
  /** 是否显示随机访问/申请友链按钮组 */
  showButtonGroup: boolean;
}

/** 友链页面完整配置 */
export interface FriendLinkConfig {
  /** 页面主标题 */
  title: string;
  /** 是否显示评论/留言申请区（已废弃，保留字段用于兼容） */
  comments: boolean;
  /** Banner 配置 */
  banner: FriendLinkBanner;
  /** 友链分组列表 */
  groups: FriendLinkGroup[];
}
