# 推送代码到 GitHub

## 方法一：使用自动化脚本（推荐）

在终端运行：

```bash
cd "/Users/songjinghui/Desktop/源代码/yuanjianzhe 系统"
./部署命令.sh
```

然后根据提示输入您的 GitHub 仓库地址即可。

---

## 方法二：手动执行命令

### 1. 进入项目目录
```bash
cd "/Users/songjinghui/Desktop/源代码/yuanjianzhe 系统"
```

### 2. 关联远程仓库
```bash
# 替换成您的 GitHub 仓库地址
git remote add origin https://github.com/您的用户名/您的仓库名.git

# 例如：
# git remote add origin https://github.com/JingHuiSong/yuanjianzhe-system.git
```

### 3. 推送代码
```bash
git push -u origin main
```

### 4. 验证推送成功
```bash
git remote -v
```

应该看到类似输出：
```
origin  https://github.com/JingHuiSong/yuanjianzhe-system.git (fetch)
origin  https://github.com/JingHuiSong/yuanjianzhe-system.git (push)
```

---

## 如果遇到认证问题

### GitHub 提示需要登录

现在 GitHub 要求使用 **Personal Access Token** 而不是密码。

**生成 Token：**

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置：
   - Note: `yuanjianzhe-deploy`
   - Expiration: `No expiration`
   - 勾选权限：`repo`（所有子选项）
4. 点击 "Generate token"
5. **复制 token**（只显示一次！）

**使用 Token 推送：**

```bash
# 方式1：在推送时输入（推荐）
git push -u origin main
# 用户名：您的 GitHub 用户名
# 密码：粘贴刚才复制的 token

# 方式2：在 URL 中包含 token
git remote set-url origin https://YOUR_TOKEN@github.com/用户名/仓库名.git
git push -u origin main
```

---

## 推送成功后

刷新您的 GitHub 仓库页面，应该能看到所有代码文件了！

下一步：前往 Vercel 部署 🚀

