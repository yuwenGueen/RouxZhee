---
# 🏷️ 团队页面配置
# 采用 YAML Frontmatter 方式，与 teek-hyde 友链配置保持一致风格
title: RZ团队
description: RouxZhee 团队介绍页面

# 🎨 品牌信息
brand:
  # 品牌 LOGO 图片路径，支持本地或外部图片
  logo: /RouxZhee-LOGO.png
  # 品牌完整名称
  name: RouxZhee
  # 品牌简称
  shortName: RZ

# 📖 品牌含义
meaning:
  # 左侧容器
  left:
    title: Roux
    lines:
      - 法语，柔软糊状物
  # 右侧容器
  right:
    title: Zhee
    lines:
      - Zenith，顶点、天顶的起音
  # 中间容器
  center:
    - 整体有着向上
    - 抵达的优雅上扬感

# 📝 品牌含义下方介绍卡片
intro:
  lines:
    - Zhee 是中文「至」的音译谐音，发音为 /ʒiː/ 或 /ziː/
    - 对应英文 Zenith（顶点、天顶、最高点）作为起始音
    - 是一个为了承载「到达极致」意境而特意设计的转写词

# ✨ 品牌 Slogan（按顺序循环播放）
slogan:
  parts:
    - RouxZhee
    - 无论是现在还是未来
    - 都会以「柔到极致」作为目标

# 👥 团队成员
members:
  - name: 余温
    avatar: https://img.xxdevops.cn/blog/avatar/yuwen_avatar.avif
    tag: 主后端
    description: 逃出了地球，没逃出SQL库
    link: https://wiki.xxdevops.cn
  - name: 白木
    avatar: https://mu.baimu.live/a/img/gura-touxiang-1.png
    tag: 主前端
    description: 学了八年机械舞，结果发现写的代码都带卡顿
    link: https://gl.baimu.live

# ☕ 投喂板块
sponsor:
  amounts:
    - 10
    - 20
    - 30
  buttonText: 投喂
  # 可接入的支付 API 接口地址
  apiUrl: ''
---

RouxZhee 团队页面配置文档。
