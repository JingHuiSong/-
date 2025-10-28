/**
 * UI配置文件 - Apple风格设计系统
 * 遵循Apple Human Interface Guidelines
 */

// 🎨 颜色系统
export const colors = {
  // 主色
  primary: '#007AFF',        // Apple蓝
  primaryHover: '#0051D5',
  primaryLight: '#E5F2FF',
  
  // 辅助色
  success: '#34C759',        // 成功绿
  successLight: '#E8F8ED',
  warning: '#FF9500',        // 警告橙
  warningLight: '#FFF3E0',
  error: '#FF3B30',          // 错误红
  errorLight: '#FFE8E6',
  
  // 背景色
  background: '#F9F9FB',
  backgroundSecondary: '#FFFFFF',
  backgroundTertiary: '#ECECEC',
  
  // 文字色
  textPrimary: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textDisabled: '#CCCCCC',
  
  // 边框色
  border: 'rgba(0, 0, 0, 0.08)',
  borderHover: 'rgba(0, 0, 0, 0.12)',
  
  // 阴影色
  shadow: 'rgba(0, 0, 0, 0.05)',
  shadowHover: 'rgba(0, 0, 0, 0.10)',
} as const;

// 📏 间距系统（8px栅格）
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px',
  '3xl': '48px',
} as const;

// 🔤 字体系统
export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Helvetica Neue", sans-serif',
    mono: 'SF Mono, Monaco, monospace',
  },
  fontSize: {
    xs: '12px',      // 次要文字
    sm: '14px',      // 正文
    base: '16px',    // 基础
    lg: '18px',      // 标题
    xl: '20px',      // 大标题
    '2xl': '24px',   // 主标题
    '3xl': '32px',   // 巨大标题
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// 📐 圆角系统
export const borderRadius = {
  sm: '8px',       // 小组件
  md: '12px',      // 默认
  lg: '16px',      // 卡片
  xl: '20px',      // 大卡片
  '2xl': '24px',   // 超大卡片
  full: '9999px',  // 圆形
} as const;

// 💫 动画配置
export const animation = {
  // 时长
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '250ms',
    slower: '300ms',
  },
  // 缓动函数
  easing: {
    // Apple标准缓动
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    // 进入动画
    enter: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    // 离开动画
    exit: 'cubic-bezier(0.4, 0.0, 1, 1)',
    // Spring弹性
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

// 🌊 阴影系统
export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
  md: '0 4px 8px rgba(0, 0, 0, 0.06)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.08)',
  xl: '0 12px 24px rgba(0, 0, 0, 0.10)',
  '2xl': '0 16px 32px rgba(0, 0, 0, 0.12)',
  // 内阴影
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
} as const;

// 📱 断点系统
export const breakpoints = {
  sm: '640px',   // 手机
  md: '768px',   // 平板
  lg: '1024px',  // 小桌面
  xl: '1280px',  // 桌面
  '2xl': '1536px', // 大桌面
} as const;

// ⚡ 性能指标
export const performance = {
  // 响应时间目标
  clickResponse: 100,      // 点击响应 <100ms
  pageTransition: 500,     // 页面切换 <500ms
  dataLoading: 1000,       // 数据加载 <1s
  
  // 动画性能
  targetFPS: 60,           // 目标帧率
  maxMemory: 400,          // 最大内存占用(MB)
} as const;

// 🎭 毛玻璃效果
export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  dark: {
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
} as const;

// 🔘 按钮尺寸
export const buttonSizes = {
  sm: {
    height: '32px',
    padding: '0 12px',
    fontSize: typography.fontSize.xs,
  },
  md: {
    height: '40px',
    padding: '0 16px',
    fontSize: typography.fontSize.sm,
  },
  lg: {
    height: '48px',
    padding: '0 24px',
    fontSize: typography.fontSize.base,
  },
} as const;

// 📊 图层层级
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  notification: 1700,
  commandBar: 1800,
} as const;

// 🎯 触控反馈
export const haptic = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  success: 'success',
  warning: 'warning',
  error: 'error',
} as const;

// 📐 布局配置
export const layout = {
  navWidth: '280px',           // 导航栏宽度
  navCollapsedWidth: '72px',   // 折叠导航宽度
  headerHeight: '64px',        // 顶部栏高度
  footerHeight: '56px',        // 底部栏高度
  sidebarWidth: '360px',       // 侧边栏宽度
  maxContentWidth: '1440px',   // 最大内容宽度
} as const;

// 🎨 渐变色
export const gradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  warning: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  error: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  info: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  apple: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
} as const;

export default {
  colors,
  spacing,
  typography,
  borderRadius,
  animation,
  shadows,
  breakpoints,
  performance,
  glassmorphism,
  buttonSizes,
  zIndex,
  haptic,
  layout,
  gradients,
};

