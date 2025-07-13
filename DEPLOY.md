# 抽奖网站部署指南

## 前提条件
在开始部署前，请确保您已注册以下账号：
- GitHub账号（已提供：2831392974）
- Vercel账号
- Supabase账号
- 高德开放平台账号（已提供API Key）

## 步骤1：准备GitHub仓库
1. 登录您的GitHub账号（2831392974）
2. 创建一个名为`cj`的新仓库（已提供仓库名称）
3. 将仓库设置为公开
4. 复制仓库的HTTPS克隆链接（格式：https://github.com/2831392974/cj.git）

## 步骤2：上传项目文件到GitHub
1. 在您的电脑上创建一个临时文件夹
2. 将所有项目文件复制到这个文件夹
3. 打开命令提示符(CMD)或PowerShell，导航到该文件夹
4. 执行以下命令：
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/2831392974/cj.git
   git push -u origin main
   ```

## 步骤3：配置Supabase数据库
1. 登录Supabase账号
2. 打开您的项目（cjl）
3. 进入SQL编辑器
4. 复制`schema.sql`文件中的所有内容
5. 粘贴到SQL编辑器中并执行
6. 进入设置 > API，找到并复制`service_role`密钥（服务端密钥）

## 步骤4：部署到Vercel
1. 登录Vercel账号
2. 点击"New Project"
3. 导入您的GitHub仓库（cj）
4. 等待Vercel检测项目设置
5. 在"Build & Output Settings"部分，确认以下设置：
   - Framework Preset: Other
   - Build Command: 留空
   - Output Directory: 留空
6. 在"Environment Variables"部分，添加以下变量：
   - SUPABASE_URL: https://sncryqjgutdauefdwsqf.supabase.co
   - SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuY3J5cWpndXRkYXVlZmR3c3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjMwMzgsImV4cCI6MjA2Nzg5OTAzOH0.9oLODVtw3hNUtMG-HzwQytRfmtrB-xWSsgrh3rFrXKA
   - SUPABASE_SERVICE_KEY: [您在步骤3中复制的服务端密钥]
   - AMAP_API_KEY: a782496f31fd0c379b1c941387e96f07
7. 点击"Deploy"按钮
8. 等待部署完成，Vercel会提供一个URL

## 步骤5：配置自定义域名（verilume.xyz）
1. 在Vercel项目仪表板中，进入"Settings"
2. 在左侧导航栏中选择"Domains"
3. 添加您的域名：verilume.xyz
4. 按照Vercel提供的说明，在您的域名提供商处更新DNS设置
5. 等待DNS生效（可能需要几分钟到几小时）

## 步骤6：验证部署
1. 访问您的域名：https://verilume.xyz
2. 确认抽奖页面正常显示
3. 点击"开始抽奖"测试功能
4. 访问管理页面：https://verilume.xyz/admin
5. 确认可以看到数据概览和访问记录

## 如何修改奖品信息
1. 访问管理页面：https://verilume.xyz/admin
2. 点击左侧导航栏中的"奖品管理"
3. 修改各个奖项的名称、图片URL和概率
4. 确保概率总和为100%
5. 点击"保存奖品设置"

## 如何查看访问数据
1. 访问管理页面：https://verilume.xyz/admin
2. 在"数据概览"中查看统计信息
3. 在"访问记录"中查看详细访问数据
4. 使用搜索框和日期筛选器查找特定记录

## 常见问题解决
- **无法连接数据库**：检查Supabase密钥和URL是否正确配置
- **抽奖后无记录**：检查Vercel环境变量是否正确设置
- **地图不显示**：检查高德API Key是否有效
- **部署失败**：确保所有文件都已上传到GitHub仓库

## 需要修改的文件位置
1. 奖品概率修改：`frontend/js/lottery.js`中的`prizes`数组
2. API密钥修改：`vercel.json`中的环境变量部分
3. 数据库连接：`frontend/js/supabaseClient.js`中的Supabase配置