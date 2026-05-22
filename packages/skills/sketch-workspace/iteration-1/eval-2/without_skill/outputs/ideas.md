# Sketch

## 2026-05-09 10:00
**Context**: /home/user/project

登录模块的 token 刷新逻辑有问题，到期前 5 分钟应该静默刷新，现在是到期后才刷新导致有短暂的 401

---

## 2026-05-09
**Context**: /mnt/d/project/Seekseek

把内存里的 session 缓存换成 Redis，解决水平扩展多实例时的状态同步问题。

**背景**：当前 session 存在进程内存中，多实例部署时不同请求可能打到不同实例，导致 session 丢失或不一致。

**方向**：
- 引入 Redis 作为集中式 session 存储
- session key 设计：`session:{sessionId}`，TTL 与原 session 过期时间对齐
- 序列化：JSON 或 MessagePack（后者更紧凑）
- 连接池管理，避免每次请求新建连接
- 考虑 Redis Sentinel 或 Cluster 保障高可用

**权衡**：
- 多一跳网络延迟（通常 <1ms，局域网内可接受）
- Redis 本身成为新的单点，需要做 HA
- session 数据不再随进程消失，需要显式清理过期/注销的 session

---
