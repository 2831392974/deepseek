# 抽奖网站项目说明

## 项目概述
这是一个完整的抽奖网站，包含前端抽奖页面和后台管理系统，使用Supabase作为数据库，部署在Vercel平台。

## 功能特点
- 前端抽奖页面，支持5种奖品设置
- 后台管理系统，可查看用户数据和修改奖品
- IP定位功能，记录访问者地理位置
- 响应式设计，适配手机和电脑

## 文件结构
```
/                   # 项目根目录
  index.html        # 前端抽奖页面
  admin.html        # 后端管理页面
  css/              # 样式表目录
  js/               # JavaScript文件目录
  supabase/         # 数据库模式文件
  README.md         # 项目说明
```

## 部署步骤
1. 将代码推送到GitHub仓库
2. 在Vercel中导入该仓库
3. 无需额外配置，Vercel会自动识别静态网站
4. 部署后访问：
   - 前端抽奖页面: https://<your-vercel-project>.vercel.app
   - 后端管理页面: https://<your-vercel-project>.vercel.app/admin.html