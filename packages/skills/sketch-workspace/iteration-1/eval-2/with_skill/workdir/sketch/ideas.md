# Sketch

## 2026-05-09 10:00
**Context**: /home/user/project

登录模块的 token 刷新逻辑有问题，到期前 5 分钟应该静默刷新，现在是到期后才刷新导致有短暂的 401

---

## 2026-05-09 14:32
**Context**: /home/dingyifan/.claude/skills/sketch-workspace/iteration-1/eval-2/with_skill/workdir

考虑把现在内存里的 session 缓存换成 Redis，这样水平扩展多实例时不会有状态同步问题

---
