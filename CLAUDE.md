# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Zhen Hui Sheng (甄慧省)** is a Uni-app cross-platform shopping rebate/coupon assistant application. It's a lightweight shopping agent based on uni-ai and uniCloud, supporting multiple platforms including WeChat Mini Program, H5, and App. The app helps users save money and earn cashback through e-commerce platforms (Taobao, JD, Pinduoduo) and local services.

**Tech Stack:**
- **Framework:** Uni-app with Vue 3 (Setup syntax)
- **State Management:** Pinia with persistedstate plugin
- **Styling:** SCSS with uview-plus UI library
- **Backend:** uniCloud (serverless)
- **Build Tool:** Vite

## Project Structure

```
├── common/                    # Shared modules and utilities
│   ├── api.js                 # Cloud function API wrapper
│   ├── common.js              # Common utilities (navigation, toast, auth)
│   └── utils.js               # Utility functions (copy, upload, etc.)
├── components/                # Reusable components
│   ├── common/                # Custom common components
│   └── uni-ad-rewarded-video/ # Video reward component
├── pages/                     # Page views (organized by feature)
│   ├── aichat/               # AI chat assistant
│   ├── cps/                  # E-commerce/cashback pages
│   ├── home/                 # Home page
│   ├── login/                # Login page
│   └── my/                   # User profile pages
├── store/                     # Pinia stores
│   ├── user-auth.js          # User authentication state
│   └── ad-track.js           # Ad tracking state
├── static/                    # Static resources
├── uni_modules/               # Uni-app official/third-party plugins
│   └── uview-plus/           # UI component library
├── util/                      # Helper modules
│   ├── dn-sdk-miniprogram/   # SDK for external platforms
│   └── request/              # Request handlers
└── pages.json                 # Page routing and global config
```

## Development Commands

```bash
# Development
npm run dev:mp-weixin    # WeChat Mini Program development
npm run dev:h5           # H5 development

# Build
npm run build:mp-weixin  # Build WeChat Mini Program
npm run build:h5         # Build H5

# For App development, use HBuilderX IDE
```

## Architecture

### State Management (Pinia)

User authentication is managed via Pinia store with localStorage persistence:

```typescript
// Store: store/user-auth.js
export const storeUserAuth = defineStore('user-auth', {
  state: {
    uid, avatar, nickname, userinfo, token, token_expired
  },
  actions: {
    wxLogin(code, avatar='', nickname='') // WeChat login
  },
  getters: {
    is_login: (state) => !!state.token
  }
})
```

### API Layer

Cloud function requests are wrapped in `common/api.js`:

```javascript
// common/api.js
export default {
  cloudHttp(obj, status=0) {
    return uniCloud.callFunction({
      name: obj.name,
      data: { action: obj.action, data: obj.data }
    })
  }
}
```

### Common Utilities

`common/common.js` provides core utilities:
- `isLogin()` - Check auth status
- `navTo(url, need_login=false, paras={})` - Navigation with auto-login
- `showToast(title)` - Show toast message

### Page Navigation Pattern

All pages use `<script setup>` syntax with proper lifecycle hooks:
- `onLoad(e)` for page load events
- `onShow()` for page show events
- Use `ref()`, `computed()`, and Vue 3 composables

Example pattern:
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import Common from "@/common/common.js"
import Api from "@/common/api.js"
import { useUserAuthStore } from "@/store/user-auth.js"

const store = useUserAuthStore()
const config = ref(null)
const userInfo = ref({})
const isLogin = ref(false)

onLoad((e) => {
  // Handle page load
})

async fetchData() {
  try {
    const res = await Api.cloudHttp({
      name: 'cps',
      action: 'ddxCps/myRestitutionMoney'
    })
    if (res.result.code !== 0) {
      Common.showToast(res.result.message)
      return
    }
    // Success handling
  } catch (e) {
    Common.showToast('请求失败')
  }
}
</script>
```

## Configuration Files

### config.js
Central configuration with CDN, API endpoints, and app settings:
```javascript
export default {
  adpid: false,
  home_ad: false,
  cdn: 'https://cdn.lapad.cc',
  logo: 'https://cdn.lapad.cc/static/zhs_logo.png',
  static: 'https://env-00jxt26g3woi.normal.cloudstatic.cn/static',
  host: 'https://env-00jxt26g3woi.normal.cloudstatic.cn',
  mp_name: '甄慧省',
  uni_appid: '__UNI__90DE23A',
  sp_loc: '/sub_pkgs'
}
```

### pages.json
Contains:
- Page routes with navigation titles
- Global styles (navigation bar colors, background)
- TabBar configuration
- SubPackages for organizing pages

Key settings:
- `navigationBarBackgroundColor`: #007AFF
- `navigationBarTextStyle`: white
- `mp-weixin.appid`: wx84bc52413480050d

## Coding Standards

### Vue 3 Setup Syntax
- Use `<script setup lang="ts">` for all components
- Import `onLoad` from `@dcloudio/uni-app` (not plain `onLoad`)
- Use `ref()` for reactive state, `computed()` for derived state
- Avoid `this.xxx` - use direct variable access

### Path Conventions
- Relative paths: `./file.js` or `../file.js`
- Project root: `@/common/api.js` or `~/store/user-auth.js`

### Naming Conventions
- Pages: PascalCase (e.g., `login.vue`, `home/index.vue`)
- Components: PascalCase (e.g., `MyButton.vue`)
- Variables/Functions: camelCase (e.g., `getUserInfo`, `handleClick`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Error Handling
All API requests must handle three cases:
1. Success response with `res.result.code === 0`
2. Error response with `res.result.code !== 0` - show `res.result.message`
3. Exception - catch error and show generic message

Use `noClick` flag to prevent duplicate clicks during async operations.

### Component Registration
The project uses Uni-app's easycom feature with custom component auto-resolution in `pages.json`:
- uview-plus components auto-resolve with pattern matching
- Custom components listed in `easycom.custom`

Example: `<singleButton />` auto-loads from `@/components/common/single-button.vue`

## Store Modules

### user-auth.js
Manages user authentication state:
- Loads from/to localStorage on init
- `wxLogin()` - WeChat OAuth login flow
- `exit()` - Logout and clear all storage
- `is_login` getter - Check if user is logged in

### ad-track.js
Ad tracking state management.

## Custom Components

Located in `components/`:
- `popupTs` - Reusable popup modal
- `singleButton` - Single action button
- `doubleButton` - Dual action buttons
- `loadMore` - List pagination indicator
- `loadingIcon` - Loading spinner
- `h-tabbar` - Horizontal tab bar

## Uni-app Platform Conditions

Use conditional compilation for platform-specific code:

```vue
<!-- #ifdef APP -->
<!-- App-specific code -->
<!-- #endif -->

<!-- #ifdef MP-WEIXIN -->
<!-- WeChat Mini Program specific code -->
<!-- #endif -->
```

## Key Files Reference

- **App.vue** - App lifecycle (onLaunch, onShow, onHide)
- **main.js** - App initialization, Pinia setup, global mixins
- **vite.config.js** - Vite/Uni-app build configuration
- **pages.json** - Page routes, global styles, TabBar

## External Dependencies

Main dependencies:
- `@dcloudio/uni-helper-json`: Uni-app JSON helper
- `better-sqlite3`: SQLite database
- `pinia`: State management
- `pinia-plugin-persistedstate`: Persist state to storage
- `uview-plus`: UI component library
- `dayjs`: Date utility

## Git Branches

- `main` - Primary branch for PRs
- Current working branch: `zhs-android`
