---
name: oral-comics
display_name: 口述漫画
description: |
  Describe a scene verbally and AI generates a 4-panel comic or manga strip. Use LLM scene understanding plus image generation API.
  用语言描述一个场景，AI自动生成4格漫画或漫画条。支持中文口述，AI理解场景后生成图像。
  trigger_phrases:
    - "帮我画个漫画"
    - "口述一个场景，生成漫画"
    - "把这个会议变成漫画"
    - "generate a comic from my description"
    - "oral comics"
    - "turn my story into manga"
version: 1.0.0
author: ai-recording-card
category: creativity
---

# 口述漫画 (Oral Comics)

## Core Capabilities

1. **场景理解** — 从语音或文字描述中理解场景、人物、动作、情绪
2. **分镜设计** — 将场景自动拆分为 4-6 格漫画的分镜脚本
3. **风格选择** — 支持多种漫画风格（日漫、美漫、Q版、简笔画、写实）
4. **图像生成** — 调用 AI 图像生成 API 生成每格画面
5. **对话气泡** — 自动添加对话文字和旁白
6. **故事增强** — AI 可以在用户描述基础上增加幽默/戏剧性元素

## User Experience Flow

```
用户输入 → 模型理解 → 执行动作 → 输出结果

1. 用户口述或输入一个场景描述
2. LLM 理解场景要素（人物、地点、动作、情绪、冲突）
3. LLM 设计分镜脚本（4-6格，每格描述+对话）
4. 调用图像生成 API 生成每格画面
5. 合成最终漫画（含对话气泡、分格线、标题）
6. 输出漫画图片（PNG / PDF）
```

## Technical Implementation

| 组件 | 技术方案 | 说明 |
|------|----------|------|
| 场景理解 | LLM | 从描述中提取场景要素 |
| 分镜设计 | LLM + 漫画知识 | 故事结构 + 分镜节奏 |
| 图像生成 | DALL-E 3 / Stable Diffusion | AI 图像生成 |
| 风格控制 | Prompt Engineering | 统一画风 |
| 文字排版 | 图像处理库 | 对话气泡、标题 |
| 合成输出 | 图像处理 | 多图拼接 |

### 核心 Prompt 框架

```python
COMIC_PROMPT = """
你是漫画编剧。请将以下场景描述转换为 4 格漫画脚本。

## 用户描述
{user_description}

## 要求
1. 设计 4 格分镜，每格包含：
   - 画面描述（用于图像生成）
   - 对话/旁白文字
   - 情绪/氛围
2. 保持故事节奏：起-承-转-合
3. 画风统一：{style}
4. 每格画面保持角色外观一致性

## 输出格式
JSON 数组，每格包含：
{
  "panel": 1,
  "image_prompt": "画面描述（英文，用于图像生成）",
  "dialogue": "对话文字",
  "narration": "旁白文字（如有）",
  "mood": "情绪标签"
}
"""

IMAGE_GEN_PROMPT = """
{base_style}, {scene_description}, 
consistent character design, clean lines, 
manga panel layout, speech bubble space,
high quality illustration
"""
```

### 漫画风格库

```yaml
styles:
  manga:
    name: 日漫风格
    prompt_suffix: "manga style, black and white, screentone, Japanese comic art"
    description: 经典日本漫画风格，黑白为主
  
  comic:
    name: 美漫风格
    prompt_suffix: "American comic book style, bold colors, dynamic poses"
    description: 漫威/DC风格，色彩丰富
  
  chibi:
    name: Q版可爱风
    prompt_suffix: "chibi style, cute characters, pastel colors, kawaii"
    description: 可爱简笔画风格
  
  webtoon:
    name: 条漫风格
    prompt_suffix: "webtoon style, vertical scroll, clean digital art"
    description: 韩国条漫风格
  
  sketch:
    name: 简笔画风格
    prompt_suffix: "simple line drawing, pencil sketch, minimalist"
    description: 简洁手绘风格
```

## Usage Examples

### 示例 1：会议趣事漫画

```
用户：帮我把今天早上的产品评审会画成漫画，要搞笑风格
系统：理解场景...设计分镜...

【漫画脚本】

标题："产品评审惊魂记"

第1格（起）：
画面：会议室，你自信满满地展示PPT
对话："这个AI录音卡，厚度只有3.89mm！"
旁白：周一上午10点，产品评审会

第2格（承）：
画面：老板推了推眼镜，表情严肃
对话："那电池续航呢？"
你：(冷汗) "呃..."

第3格（转）：
画面：你灵机一动，拿出手机
对话："所以我们要加无线充电！"
众人：(星星眼) "哇！"

第4格（合）：
画面：你走出会议室，擦汗
对话："又过了一关..."
旁白：产品经理的日常

正在生成漫画...
【漫画已生成】（4格日漫风格漫画图）
```

### 示例 2：日常故事漫画

```
用户：口述一个场景——我今天早上差点迟到，一路狂奔到公司
系统：正在生成漫画...

【漫画脚本】

标题："打工人早高峰历险记"

第1格：闹钟显示8:45，你从床上弹起
第2格：刷牙洗脸换衣服，动作模糊残影
第3格：地铁上挤成沙丁鱼，头发被门夹住
第4格：8:59冲进公司打卡，显示"打卡成功"
第5格（彩蛋格）：坐下后发现——今天是周六

（选择了简笔画风格）

【漫画已生成】
```

### 示例 3：把录音变成漫画

``用户：把上周那个客户谈判的场景画出来，要有戏剧性
系统：分析录音内容...提取关键场景...

【漫画脚本】

标题："价格谈判：终极对决"

第1格：谈判桌两侧，你和客户对峙，气势碰撞
对话：客户："¥499太贵了！" 你："但成本真的..."

第2格：你拿出竞品分析报告，化身为"数据战士"
对话："看看竞品的定价..."

第3格：客户陷入沉思，头顶出现天平（价格vs价值）
旁白：谈判的转折点

第4格：握手成交，背景烟花绽放
对话："合作愉快！"

（选择了美漫风格，戏剧性十足）

【漫画已生成】
```

## Dependencies

| 依赖项 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| LLM 推理服务 | 云端/本地 | 是 | 场景理解与分镜设计 |
| 图像生成 API | 云端 | 是 | DALL-E 3 / SD 等 |
| 图像处理库 | 内部 | 是 | 拼接、气泡、排版 |
| ASR 转写服务 | 内部 | 否 | 语音描述转文字 |
| TTS | 云端/本地 | 否 | 漫画朗读（无障碍） |

## Integration Points

- **录音卡录音系统** — 可将录音场景直接转化为漫画
- **ASR 转写服务** — 语音描述转为文字用于场景理解
- **名人对谈** — 名人形象可以作为漫画角色
- **情绪调色板** — 漫画风格可匹配当前情绪
- **给未来的信** — 漫画形式记录重要时刻
- **年度述职生成器** — 关键成就可以用漫画形式呈现
- **AI辩论赛** — 辩论场景可以漫画化
- **社交分析图谱** — 人物关系可以用漫画形式展示
