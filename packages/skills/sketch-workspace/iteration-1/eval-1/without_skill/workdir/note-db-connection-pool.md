# 待办：数据库连接池大小改为环境变量配置

**记录时间**：2026-05-09

## 问题描述

数据库连接池大小当前硬编码为 `10`，缺乏灵活性，不同环境（开发/测试/生产）可能需要不同的值。

## 改造方案

将连接池大小改为从环境变量读取，保留默认值 `10` 作为兜底。

示例（以 Python 为例）：

```python
import os

pool_size = int(os.environ.get("DB_POOL_SIZE", 10))
```

其他语言类似处理：
- **Node.js**：`parseInt(process.env.DB_POOL_SIZE ?? '10', 10)`
- **Java**：`Integer.parseInt(System.getenv().getOrDefault("DB_POOL_SIZE", "10"))`
- **Go**：使用 `os.Getenv("DB_POOL_SIZE")`，解析后若为零值则回退到 `10`

## 需要跟进的事项

- [ ] 找到代码中硬编码 `10` 的位置，完成改造
- [ ] 在 `.env.example` / 配置文档中添加 `DB_POOL_SIZE` 的说明
- [ ] 确认各环境（dev / staging / prod）的合理默认值
- [ ] 视情况添加对非法值（非正整数）的校验和错误提示
