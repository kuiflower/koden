# KODEN

工具实体店介绍与商品展示站：中日双语前台、后台分类/商品管理、商品预订到店与一般到店预约。部署方式对齐 charter-ride。

## 一图看懂：本地 / GitHub / 线上

```text
本地改代码  →  Push 到 GitHub  →  Vercel 自动部署  →  网站更新
   Cursor          代码仓库              托管平台           线上访问
```

| 角色 | 是什么 | 你要做什么 |
|---|---|---|
| **本地项目** | 你电脑上的开发目录 | 改代码、本地预览 |
| **GitHub** | 代码的「正式存档」 | Commit 后务必 Push |
| **Vercel** | 网站托管与上线 | 一般不用手动操作，跟 GitHub 自动同步 |

## 本地开发

```bash
npm install
npm run dev
```

- 日文首页：http://localhost:3000/ja
- 中文首页：http://localhost:3000/zh
- 后台：http://localhost:3000/admin（密码默认 `admin123`）

## 主要功能（基础框架）

- 前台：`/ja` · `/zh` 双语路径，分类展示、商品详情、商品预订到店、一般到店预约
- 后台：分类 / 商品 CRUD，商品预订列表，到店预约列表，中日界面切换
- SEO：metadata、hreflang、sitemap、robots、商品 JSON-LD
- 数据：本地 `data/*.json`；线上配置 `BLOB_READ_WRITE_TOKEN` 后走 Vercel Blob 持久化（免费额度内）

## 线上环境变量（Vercel）

- `ADMIN_PASSWORD`：后台密码
- `BLOB_READ_WRITE_TOKEN`：Vercel Blob（Storage 创建后自动注入）
- `NEXT_PUBLIC_SITE_URL`：正式站点 URL（用于 sitemap / canonical）

## 技術棧

Next.js · React · TypeScript · Tailwind CSS · Sharp · Vercel Blob · Vercel（tokyo `hnd1`）
