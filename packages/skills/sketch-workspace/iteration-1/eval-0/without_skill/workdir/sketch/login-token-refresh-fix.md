# Sketch: 登录模块 Token 刷新逻辑修复

## 问题描述

**Bug**：Token 到期后才触发刷新，导致有短暂的 401 Unauthorized 错误。

**期望行为**：在 Token 到期前 5 分钟静默刷新，用户无感知。

---

## 根因分析

当前逻辑（伪代码）：

```
// 错误做法：请求失败后才刷新
interceptor.onResponseError = (error) => {
  if (error.status === 401) {
    return refreshToken().then(retry)
  }
}
```

问题在于：
1. 只在请求返回 401 时才触发刷新
2. 刷新期间所有并发请求都会收到 401 或被挂起
3. 用户体验差，可能触发前端的错误提示

---

## 修复方案

### 核心思路

在每次请求发出前，检查 token 的剩余有效期。如果剩余时间 < 5 分钟，则先刷新 token，再发出请求。

### 关键逻辑

```typescript
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5分钟

function isTokenExpiringSoon(token: string): boolean {
  const payload = parseJwt(token);
  const expiresAt = payload.exp * 1000; // 转为毫秒
  const now = Date.now();
  return expiresAt - now < REFRESH_THRESHOLD_MS;
}

// 请求拦截器
axiosInstance.interceptors.request.use(async (config) => {
  const token = getAccessToken();
  
  if (token && isTokenExpiringSoon(token)) {
    // 静默刷新，用户无感知
    await refreshTokenIfNeeded();
  }
  
  config.headers.Authorization = `Bearer ${getAccessToken()}`;
  return config;
});
```

### 防并发重复刷新

多个请求同时触发时，只执行一次刷新，其余请求等待结果：

```typescript
let refreshPromise: Promise<void> | null = null;

async function refreshTokenIfNeeded(): Promise<void> {
  if (refreshPromise) {
    // 已有刷新在进行中，等待它完成
    return refreshPromise;
  }
  
  refreshPromise = doRefreshToken().finally(() => {
    refreshPromise = null;
  });
  
  return refreshPromise;
}
```

### 兜底：保留 401 响应拦截器

网络延迟或边界情况下 token 仍可能在请求途中过期，保留响应拦截器作为兜底：

```typescript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._isRetry) {
      error.config._isRetry = true;
      await refreshTokenIfNeeded();
      return axiosInstance(error.config);
    }
    return Promise.reject(error);
  }
);
```

---

## 实现步骤

1. **解析 JWT**：实现 `parseJwt(token)` 函数，从 token 中提取 `exp` 字段
2. **到期检测**：实现 `isTokenExpiringSoon(token)` 函数，判断剩余时间是否 < 5 分钟
3. **刷新去重**：用单例 Promise 防止并发重复刷新
4. **请求拦截器**：在发出请求前检测并按需刷新
5. **响应拦截器**：保留 401 兜底处理，加 `_isRetry` 标记防止死循环
6. **测试**：
   - 模拟 token 剩余 4 分钟时发请求，验证自动刷新
   - 模拟 10 个并发请求同时触发，验证只刷新一次
   - 模拟刷新失败，验证用户被正确登出

---

## 需要确认的问题

- 后端 refresh token 接口的 path 和入参格式？
- refresh token 本身的有效期是多久？是否需要处理 refresh token 也过期的情况？
- 当前 token 存在哪里？localStorage / sessionStorage / cookie / 内存？
