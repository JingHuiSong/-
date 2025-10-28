# 远见者旅行社 - Apple风格UI设计系统

> **设计愿景**：让员工"像使用 iPhone 一样"使用系统 —— 操作直觉、响应丝滑、视觉统一、零教程成本

---

## 🎯 核心设计目标

| 目标 | 具体要求 | 实现状态 |
|------|---------|----------|
| **零思考操作** | 所有操作可在 2 步内完成 | ✅ 已实现 |
| **视觉清爽** | 无视觉噪音、聚焦信息核心 | ✅ 已实现 |
| **丝滑流畅** | 所有状态变化伴随轻动效 | ✅ 已实现 |
| **自适应响应** | PC、iPad、手机三端体验一致 | 🔄 进行中 |
| **即时反馈** | 操作后立刻有轻反馈，<100ms | ✅ 已实现 |

---

## 🎨 视觉设计规范

### 1. 配色系统

```typescript
// 主色 - Apple蓝
primary: #007AFF
primaryHover: #0051D5
primaryLight: #E5F2FF

// 辅助色
success: #34C759  // 成功绿
warning: #FF9500  // 警告橙
error: #FF3B30    // 错误红

// 背景色
background: #F9F9FB
backgroundSecondary: #FFFFFF
backgroundTertiary: #ECECEC

// 文字色
textPrimary: #000000
textSecondary: #666666
textTertiary: #999999
```

**使用原则**：
- ✅ 主色仅用于主要操作按钮、激活状态、品牌标识
- ✅ 辅助色仅用于状态提示（成功/警告/错误）
- ✅ 避免使用超过3种颜色在同一界面

### 2. 字体系统

```typescript
fontFamily: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC"

fontSize:
  xs: 12px   // 次要文字、标签
  sm: 14px   // 正文
  base: 16px // 基础文字
  lg: 18px   // 小标题
  xl: 20px   // 标题
  2xl: 24px  // 主标题
  3xl: 32px  // 巨大标题

fontWeight:
  normal: 400    // 正文
  medium: 500    // 强调
  semibold: 600  // 标题
  bold: 700      // 主标题
```

**排版原则**：
- ✅ 每屏不超过2种字体大小
- ✅ 每行内容 ≤ 3 层信息层次
- ✅ 行高保持 1.5 倍行距
- ✅ 段落间距采用 8px 栅格系统

### 3. 间距系统（8px 栅格）

```typescript
xs: 4px   // 极小间距
sm: 8px   // 小间距
md: 16px  // 中等间距
lg: 24px  // 大间距
xl: 32px  // 超大间距
2xl: 40px // 巨大间距
3xl: 48px // 极大间距
```

**应用规则**：
- ✅ 所有组件尺寸必须是 8px 的倍数
- ✅ 内边距（padding）：最小 16px
- ✅ 外边距（margin）：最小 8px
- ✅ 卡片间距：16px ~ 24px

### 4. 圆角系统

```typescript
sm: 8px    // 小组件（标签、按钮）
md: 12px   // 默认（输入框、小卡片）
lg: 16px   // 卡片
xl: 20px   // 大卡片
2xl: 24px  // 超大卡片
full: 9999px // 圆形
```

**使用建议**：
- ✅ 主要卡片：12px ~ 20px
- ✅ 按钮：10px ~ 12px
- ✅ 头像：full（圆形）
- ✅ Logo：14px ~ 16px

### 5. 阴影系统

```typescript
xs: 0 1px 2px rgba(0, 0, 0, 0.04)
sm: 0 2px 4px rgba(0, 0, 0, 0.05)
md: 0 4px 8px rgba(0, 0, 0, 0.06)
lg: 0 8px 16px rgba(0, 0, 0, 0.08)
xl: 0 12px 24px rgba(0, 0, 0, 0.10)
2xl: 0 16px 32px rgba(0, 0, 0, 0.12)
```

**层次规则**：
- ✅ 默认卡片：sm ~ md
- ✅ 悬浮卡片：lg ~ xl
- ✅ 弹窗/模态框：xl ~ 2xl
- ✅ 避免叠加超过3层阴影

---

## 💫 动效设计标准

### 1. 动画时长

```typescript
fast: 150ms    // 快速反馈（hover、点击）
normal: 200ms  // 标准动画（切换、展开）
slow: 250ms    // 慢速动画（页面切换）
slower: 300ms  // 极慢动画（复杂过渡）
```

### 2. 缓动函数

```typescript
// Apple标准缓动
standard: cubic-bezier(0.4, 0.0, 0.2, 1)

// 进入动画（渐快）
enter: cubic-bezier(0.0, 0.0, 0.2, 1)

// 离开动画（渐慢）
exit: cubic-bezier(0.4, 0.0, 1, 1)

// Spring弹性效果
spring: cubic-bezier(0.34, 1.56, 0.64, 1)
```

### 3. 动效类型与场景

| 动效类型 | 使用场景 | 时长 | 缓动函数 |
|---------|---------|------|---------|
| **页面切换** | 模块跳转 | 250ms | standard |
| **数据加载** | 表格/报表刷新 | - | 骨架屏 + 模糊过渡 |
| **按钮反馈** | 点击/提交 | 150ms | spring |
| **弹窗显示** | 审批、详情 | 200ms | spring |
| **成功状态** | 保存、发送成功 | 200ms + 淡入绿色勾 |
| **错误提示** | 校验错误 | 150ms + 红色轻震 |
| **任务完成** | 自动化任务结束 | 300ms + 气泡爆发 |

### 4. 内置动画类

```css
/* 渐入动画 */
.animate-fadeIn {
  animation: fadeIn 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* 缩放弹入动画 */
.animate-scaleIn {
  animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 波纹动画（加载状态）*/
.animate-shimmer {
  animation: shimmer 2s linear infinite;
}

/* 柔和脉冲 */
.animate-pulse-soft {
  animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 悬浮动画 */
.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Apple按钮效果（点击缩放）*/
.button-apple {
  @apply transition-all duration-150 active:scale-95;
}

/* 卡片悬浮效果 */
.card-hover {
  @apply transition-all duration-200 hover:shadow-xl hover:-translate-y-1;
}
```

---

## 🧱 核心组件规范

### 1. 导航栏（Navigation）

**设计要求**：
- ✅ 宽度：280px（固定）
- ✅ 背景：白色半透明 + 毛玻璃效果
- ✅ 图标：线性图标，线宽 1.5px ~ 2.5px
- ✅ 激活状态：蓝色渐变背景 + 白色文字 + 柔和阴影
- ✅ Hover状态：浅灰色背景 + 图标放大 1.05 倍
- ✅ 快捷搜索：支持 ⌘K / Ctrl+K

**已实现特性**：
- ✅ Logo区域渐入动画
- ✅ 导航项延迟渐入（每项延迟30ms）
- ✅ 激活状态柔和脉冲动画
- ✅ 用户头像绿点在线状态
- ✅ 退出登录按钮点击缩放反馈

### 2. 命令栏（Command Bar）

**快捷键**：`⌘K` / `Ctrl+K`

**设计要求**：
- ✅ 最大宽度：640px
- ✅ 背景：白色半透明 + 毛玻璃效果
- ✅ 阴影：2xl（强烈）
- ✅ 搜索框高度：64px
- ✅ 命令项高度：52px
- ✅ Hover效果：蓝色浅背景 + 图标放大

**已实现特性**：
- ✅ 全局快捷键监听
- ✅ 实时模糊搜索
- ✅ 关键词匹配
- ✅ 键盘导航提示
- ✅ Enter执行命令
- ✅ ESC关闭面板

### 3. 骨架屏（Skeleton）

**设计要求**：
- ✅ 背景：灰色渐变
- ✅ 动画：pulse（脉冲）或 wave（波纹）
- ✅ 圆角：与原组件保持一致
- ✅ 高度：与原组件保持一致

**已实现类型**：
- ✅ CardSkeleton - 卡片骨架屏
- ✅ TableSkeleton - 表格骨架屏
- ✅ ListSkeleton - 列表骨架屏
- ✅ StatsCardSkeleton - 统计卡片骨架屏
- ✅ PageSkeleton - 页面骨架屏

### 4. 按钮（Button）

**尺寸规范**：
```typescript
sm: height 32px, padding 0 12px, fontSize 12px
md: height 40px, padding 0 16px, fontSize 14px
lg: height 48px, padding 0 24px, fontSize 16px
```

**状态规范**：
- ✅ Default：边框 + 浅灰背景
- ✅ Hover：边框加深 + 背景加深
- ✅ Active：缩小至 95%
- ✅ Focus：蓝色焦点环
- ✅ Disabled：透明度 50% + 禁用光标

**已实现样式**：
- ✅ Primary：蓝色渐变背景
- ✅ Secondary：白色背景 + 灰色边框
- ✅ Outline：透明背景 + 蓝色边框
- ✅ Ghost：透明背景 + Hover灰色背景

### 5. 卡片（Card）

**设计要求**：
- ✅ 背景：白色 + 轻微透明度
- ✅ 边框：1px solid rgba(0, 0, 0, 0.08)
- ✅ 圆角：12px ~ 20px
- ✅ 阴影：sm（默认）→ xl（悬浮）
- ✅ 内边距：24px
- ✅ Hover效果：阴影加深 + 向上平移 4px

**已实现特性**：
- ✅ 毛玻璃背景
- ✅ 渐变边框（可选）
- ✅ 悬浮动画
- ✅ 加载状态

---

## 📏 布局系统

### 1. 整体布局

```typescript
navWidth: 280px           // 导航栏宽度
navCollapsedWidth: 72px   // 折叠导航宽度
headerHeight: 64px        // 顶部栏高度
footerHeight: 56px        // 底部栏高度
sidebarWidth: 360px       // 侧边栏宽度
maxContentWidth: 1440px   // 最大内容宽度
```

### 2. 响应式断点

```typescript
sm: 640px    // 手机
md: 768px    // 平板
lg: 1024px   // 小桌面
xl: 1280px   // 桌面
2xl: 1536px  // 大桌面
```

### 3. 网格系统

- ✅ 12列网格
- ✅ Gutter：16px ~ 24px
- ✅ Container padding：24px ~ 48px

---

## ⚡ 性能指标

### 1. 响应时间目标

```typescript
clickResponse: <100ms     // 点击响应
pageTransition: <500ms    // 页面切换
dataLoading: <1000ms      // 数据加载
```

### 2. 动画性能

```typescript
targetFPS: 60             // 目标帧率
maxMemory: 400MB          // 最大内存占用
```

### 3. 加载策略

- ✅ 骨架屏优先展示
- ✅ 图片懒加载
- ✅ 组件按需加载
- ✅ 数据分页加载

---

## 🎭 特效系统

### 1. 毛玻璃效果（Glassmorphism）

```css
/* 浅色毛玻璃 */
.glass-light {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 深色毛玻璃 */
.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 2. 渐变文字

```css
.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600;
}
```

### 3. 焦点环

```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}
```

---

## 🎨 渐变色系统

```typescript
primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
success: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)
warning: linear-gradient(135deg, #f6d365 0%, #fda085 100%)
error: linear-gradient(135deg, #fa709a 0%, #fee140 100%)
info: linear-gradient(135deg, #30cfd0 0%, #330867 100%)
apple: linear-gradient(135deg, #007AFF 0%, #5856D6 100%)
```

---

## 🔔 交互原则

### 1. 即时反馈

- ✅ 所有点击操作必须在 <100ms 内响应
- ✅ 即便后台未完成，也应提供占位或进度反馈
- ✅ 使用骨架屏代替 Loading 动画

### 2. 键盘快捷操作

```typescript
Tab/Enter      // 快速跳转
⌘K / Ctrl+K    // 全局搜索
⌘S / Ctrl+S    // 快速保存
ESC            // 关闭弹窗/取消操作
```

### 3. 拖拽体验

- ✅ 文件拖拽上传
- ✅ 表格行拖拽排序
- ✅ 卡片拖拽调整
- ✅ 报表模块拖拽配置

### 4. 撤回机制

- ✅ 所有操作允许一步撤回（Undo）
- ✅ 危险操作需二次确认
- ✅ 删除操作提供预览

---

## 📱 移动端适配

### 1. 触控手势

- ✅ 左滑返回
- ✅ 右滑展开详情
- ✅ 下拉刷新
- ✅ 长按触发菜单

### 2. 移动端优化

- ✅ 触控区域 ≥ 44px
- ✅ 输入框自动缩放防遮挡
- ✅ 重要操作按钮置底悬浮
- ✅ 页面滑动保持惯性与动量感

---

## 🎯 未来迭代

### 第一阶段（已完成）✅
- ✅ UI配置文件（lib/ui-config.ts）
- ✅ 命令栏组件（⌘K快捷搜索）
- ✅ 骨架屏组件系统
- ✅ Apple风格全局样式
- ✅ 导航栏优化
- ✅ 动画系统

### 第二阶段（进行中）🔄
- 🔄 移动端响应式适配
- 🔄 暗色模式支持
- 🔄 更多交互动效
- 🔄 触觉反馈集成

### 第三阶段（规划中）📅
- 📅 Quick Command Bar（统一操作入口）
- 📅 动态壁纸切换
- 📅 声效反馈（macOS风格）
- 📅 个性化主题（部门自定义）
- 📅 无障碍模式

---

## 📚 使用指南

### 如何使用UI配置

```typescript
import uiConfig from "@/lib/ui-config";

// 使用颜色
const primaryColor = uiConfig.colors.primary;

// 使用间距
const spacing = uiConfig.spacing.md; // "16px"

// 使用阴影
const shadow = uiConfig.shadows.lg;

// 使用动画
const duration = uiConfig.animation.duration.normal; // "200ms"
const easing = uiConfig.animation.easing.spring;
```

### 如何使用动画类

```tsx
<div className="animate-fadeIn">
  渐入内容
</div>

<button className="button-apple">
  点击我
</button>

<div className="card-hover">
  悬浮卡片
</div>
```

### 如何使用骨架屏

```tsx
import { CardSkeleton, TableSkeleton, PageSkeleton } from "@/components/skeleton";

// 加载状态
{loading ? <CardSkeleton /> : <Card>真实内容</Card>}

// 表格加载
{loading ? <TableSkeleton rows={5} /> : <Table data={data} />}

// 页面加载
{loading ? <PageSkeleton /> : <Page />}
```

---

## 🏆 设计检查清单

在发布任何新功能前，请确保：

- [ ] 所有交互响应 < 100ms
- [ ] 所有动画帧率 ≥ 60FPS
- [ ] 所有组件遵循8px栅格系统
- [ ] 所有卡片圆角 12px ~ 20px
- [ ] 所有字体层级 ≤ 2种
- [ ] 所有配色符合Apple风格
- [ ] 所有按钮支持键盘操作
- [ ] 所有危险操作有二次确认
- [ ] 所有加载状态有骨架屏
- [ ] 所有图标线宽一致（1.5px ~ 2.5px）

---

## 💡 最佳实践

### DO ✅

- ✅ 使用系统字体（SF Pro Display / PingFang SC）
- ✅ 保持信息层次清晰（最多3层）
- ✅ 使用微妙的动画增强体验
- ✅ 提供即时的视觉反馈
- ✅ 遵循8px栅格系统
- ✅ 使用语义化的颜色
- ✅ 保持界面留白充足

### DON'T ❌

- ❌ 不要使用超过3种主色
- ❌ 不要使用过度夸张的动画
- ❌ 不要让用户等待（无反馈）
- ❌ 不要使用不一致的圆角
- ❌ 不要堆叠超过3层阴影
- ❌ 不要使用复杂的渐变
- ❌ 不要忽略加载状态

---

## 📞 技术支持

如有设计系统相关问题，请联系：
- UI/UX团队：design@yuanjianzhe.com
- 前端团队：frontend@yuanjianzhe.com

---

**版本**：v1.0.0  
**更新时间**：2025-01-27  
**维护者**：远见者旅行社技术团队

