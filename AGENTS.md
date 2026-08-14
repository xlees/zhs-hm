# AGENTS.md - uni-app 项目开发指南

## 项目结构与模块组织

### 目录结构
```
├── common/          # 公共模块
│   ├── api.js       # API 请求封装
│   ├── common.js    # 公共工具函数
│   └── utils.js     # 工具类
├── components/      # 公共组件
├── config.js        # 项目配置文件
├── lib/            # 第三方库
├── pages/          # 页面目录
│   ├── aichat/     # AI 聊天相关页面
│   ├── cps/        # 电商相关页面
│   ├── home/       # 首页
│   ├── login/      # 登录页面
│   └── my/         # 我的页面
├── store/          # Pinia 状态管理
│   ├── user-auth.js    # 用户认证状态
│   └── ad-track.js     # 广告追踪状态
├── static/         # 静态资源
├── uni_modules/    # uni-app 官方及第三方插件
├── util/           # 工具函数
└── pages.json      # 路由配置
```

### 模块组织规则
- **页面模块**: `pages/` 目录下按功能模块分组（home, my, cps, aichat 等）
- **公共组件**: `components/` 存放可复用的组件
- **状态管理**: `store/` 使用 Pinia 管理全局状态
- **公共资源**: `common/` 存放 API、工具函数等公共资源

## 构建命令

### 开发
```bash
# H5 开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin

# HBuilderX 运行
# 使用 HBuilderX 的"运行到小程序"或"运行到浏览器"
```

### 打包
```bash
# 微信小程序打包
npm run build:mp-weixin

# H5 打包
npm run build:h5
```

## 代码风格与协作规则

### 1. Vue3 Setup 语法规范
- **必须使用 `<script setup>`** 语法糖
- 响应式变量使用 `ref` 或 `reactive`
- 计算属性使用 `computed`
- 生命周期使用 `onLoad(e)` 而非 `onLoad()`
- 组件内直接导入使用，避免 `this.xxx`

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Common from '@/common/common.js'

const name = ref('')
const items = ref([])

onLoad((e) => {
  // 生命周期逻辑
})

function handleClick() {
  // 方法逻辑
}
</script>
```

### 2. 导入路径规范
- 相对路径使用 `./` 或 `../`
- 项目根路径使用 `@` 或 `~`
- 示例：`@/common/api.js`、`~/store/user-auth.js`

### 3. 命名规范
- **页面**: `PascalCase` (如：`login.vue`、`home/index.vue`)
- **组件**: `PascalCase` (如：`MyButton.vue`)
- **变量/函数**: `camelCase` (如：`getUserInfo`, `handleClick`)
- **常量**: `UPPER_SNAKE_CASE` (如：`API_BASE_URL`)
- **目录**: `kebab-case` 或 `PascalCase` (如：`my-profile`)

### 4. 类型规范 (TypeScript)
- 所有组件建议添加 `.ts` 后缀
- 函数参数必须声明类型
- 返回值建议声明类型
- 使用 `any` 需尽量避免

```typescript
function handleClick(e: UniApp.TouchEvent): void {
  console.log(e.detail)
}
```

### 5. 错误处理规范
- API 请求必须处理成功/失败/异常三种情况
- 统一使用 `Common.showToast()` 提示用户
- 异常情况下设置 `noClick = true` 防止重复点击

```javascript
async fetchData() {
  try {
    const res = await Api.cloudHttp(obj)
    if (res.result.code !== 0) {
      Common.showToast(res.result.message)
      return
    }
    // 成功处理
  } catch (e) {
    Common.showToast(e.message || '请求失败')
  }
}
```

### 6. 注意事项
- **输入框兼容性**: 对 `input`/`textarea` 不要设置 `box-sizing: border-box`
- **样式隔离**: 页面样式使用 scoped，避免全局污染
- **性能优化**: 列表使用 `v-for` 时务必加 `:key`
- **异步操作**: 避免在 `onLoad` 中执行过多异步请求

## 常用命令

```bash
# 运行单个页面测试
npm run dev:mp-weixin -- --watch pages/home/index.vue

# 检查代码规范
npm run lint

# 类型检查
npm run typecheck
```

## 快捷指令

```javascript
// 跳转页面
Common.navigate(url)

// 显示提示
Common.showToast(message, icon)

// 复制文本
Common.fz(text, title)

// 显示模态框
Common.showModal({ title, content, success })
```

## 状态管理 (Pinia)

```typescript
// 创建 store
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null
  }),
  actions: {
    async login(data) {
      // 登录逻辑
    }
  }
})

// 组件中使用
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/user-auth.js'

const userStore = storeToRefs(useUserStore())
```
