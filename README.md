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
/frontend           # 前端页面
  /public           # 静态资源
  /src              # 源代码
    /components     # 组件
    /pages          # 页面
      index.html    # 抽奖页面
      admin.html    # 管理页面
    /js             # JavaScript文件
    /css            # 样式文件
/functions          # Vercel云函数
/supabase           # Supabase配置
.env                # 环境变量
vercel.json         # Vercel配置
package.json        # 项目依赖
```

## 部署步骤
1. 将代码推送到GitHub仓库
2. 在Vercel中连接GitHub仓库
3. 配置环境变量
4. 部署完成