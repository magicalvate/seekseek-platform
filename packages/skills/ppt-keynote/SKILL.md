---
name: ppt-keynote
zh_name: "Keynote 风格 PPT"
en_name: "Keynote-style Slides"
emoji: "🎬"
description: "Apple Keynote-quality slides, one card per screen, with keyboard left/right navigation."
zh_description: "苹果 Keynote 级别幻灯片, 一屏一卡, 键盘左右切换"
en_description: "Apple Keynote-quality slides, one card per screen, with keyboard left/right navigation."
category: slides
scenario: marketing
aspect_hint: "16:9 (1280×720)"
featured: 19
tags: ["slides", "deck", "presentation", "幻灯片", "演讲"]
example_id: sample-ppt-html-anything
example_name: "Keynote PPT · 产品介绍"
example_format: markdown
example_tagline: "7 张幻灯片讲清产品"
example_desc: "苹果 Keynote 风格的产品介绍, ←/→ 切换"
od:
  mode: deck
  surface: web
  scenario: marketing
  upstream: "https://github.com/nexu-io/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: "Use the Keynote-style Slides template to turn my content into Apple Keynote-quality slides with one card per screen and keyboard left/right navigation. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    zh-CN: "用「Keynote 风格 PPT」模板把我的内容做成一套「苹果 Keynote 级别幻灯片, 一屏一卡, 键盘左右切换」。保持模板的视觉签名，使用真实内容和数据，避免 lorem ipsum 和占位图片。"
---

【模板: Keynote 风格 PPT】

## Step 1 · 确认页数

**在动手前先明确页数**，优先级从高到低：
1. 用户在 ARGUMENTS 里明确指定了页数（如「6 页」「10 张」）→ 严格遵守
2. 用户给了完整大纲 → 每个一级要点对应 1 页，封面 + 结尾各 1 页
3. 两者都没有 → 按内容量判断，参考：简短主题 5–7 页，中等内容 8–12 页，长内容 13–20 页

## Step 2 · 生成 HTML 幻灯片

按以下规则生成单文件 HTML，文件名为 `<主题>.html`：

- 每张幻灯片是一个 `<section class="slide">`，整体宽 1280 高 720，居中显示，背景渐变。
- 单页内容极简：大标题 + 1–3 行支持文字；或一张数据图；或一个金句。
- 字号：标题 `font-size: 72px; font-weight: 600; letter-spacing: -0.03em`，副标题 `font-size: 22px; color: #6b7280`。
- 第一页是封面（主题 + 演讲者 / 日期），最后一页是「Thanks.」或行动号召。
- 顶部右上角小指示器：当前页 / 总页数。
- 加一段 JavaScript 监听 ArrowLeft / ArrowRight / 空格键切换 slide；同时维护 hash（`#/3`）。
- 每页之间用 fade-in 动画（`transition: opacity 0.35s ease`）。
- 保持留白，数据卡片用 grid 布局对齐，颜色克制。

## Step 3 · 自动转换为 PPTX

HTML 写完后，**立即**运行以下命令生成 WPS / PowerPoint 可打开的 `.pptx` 文件：

```bash
python3 .claude/skills/ppt-keynote/html_to_pptx.py <生成的HTML文件路径> <同名.pptx路径>
```

例如生成了 `my-deck.html`，则运行：
```bash
python3 .claude/skills/ppt-keynote/html_to_pptx.py my-deck.html my-deck.pptx
```

转换完成后报告：
- HTML 文件路径（浏览器可直接打开演示）
- PPTX 文件路径（WPS / PowerPoint 可编辑）
- 实际生成的幻灯片数量
