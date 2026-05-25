# Skills

基于 Claude Code 的 AI 技能包集合，覆盖创意写作、职业发展、社交智能、健康管理等场景。

## 安装

```bash
# macOS / Linux
bash install.sh

# Windows
.\install.ps1
```

安装脚本会将所有 skill 软链接到 `~/.claude/skills/`，Claude Code 启动后自动加载。

---

## Skill 一览

### 🟢 开箱即用（纯 LLM，无外部依赖）

| Skill | 目录 | 功能简介 | 触发示例 |
|---|---|---|---|
| **周览报告** | `weekly-report` | 将一周的笔记、日志聚合成结构化周报，提取主题趋势和下周重点 | "帮我写周报"、"总结一下这周" |
| **进展复盘** | `work-reviewer` | 工作记录 → 阶段性复盘报告，分战功和内功两个维度，第一人称撰写 | "写复盘"、"绩效总结" |
| **故事工坊** | `story-workshop` | 把真实经历或想法创作成有文学质感的故事、散文或小说章节 | "把这段经历写成故事" |
| **名人对谈** | `celebrity-chat` | 模拟乔布斯、马斯克、雷军等名人视角，对你的会议内容发表点评 | "如果是乔布斯会怎么说" |
| **正念引导** | `mindfulness-guide` | 根据压力和情绪状态，生成个性化冥想引导和呼吸练习 | "我压力好大，帮我放松" |
| **给未来的信** | `letter-to-future` | 写一封给未来自己的信，记录当下状态和目标 | "给未来的自己写封信" |
| **谈判复盘器** | `negotiation-review` | 分析谈判记录，提取对方策略、识别遗漏机会、生成结构化复盘 | "复盘这场谈判" |
| **情绪调色板** | `emotional-palette` | 分析情绪变化模式，用颜色和形状可视化描述，给出调节建议 | "分析我的情绪变化" |
| **性格测试Pro** | `personality-test-pro` | 基于对话样本，用 MBTI / DISC / 大五人格多框架进行深度性格分析 | "分析我的性格" |
| **职业教练** | `career-coach` | 基于工作背景，用 GROW 模型提供职业发展建议和行动计划 | "给我职业发展建议" |
| **简历生成** | `resume-generator` | 从工作经历描述提取 STAR 格式的简历素材，含 ATS 关键词优化 | "帮我写简历" |
| **社交分析图谱** | `social-graph` | 构建人脉关系网络，分析关系动态，给出维护建议 | "分析我的人脉关系" |
| **AI辩论赛** | `ai-debate` | 给定话题，AI 扮演对方辩手，支持多轮实时辩论 | "帮我练习辩论" |
| **年度述职** | `annual-report` | 聚合全年工作记录，生成 STAR 格式的年度述职报告 | "生成年度述职" |

---

### 🟡 部分可用（核心功能正常，特定功能需额外配置）

| Skill | 目录 | 核心功能 | 需要额外配置 |
|---|---|---|---|
| **开场白建议** | `opening-remarks` | 生成会前破冰开场白（直接提供背景即可使用） | 自动读取历史录音需要 `mcp__ec-bridge__search_recordings` 权限 |
| **口述漫画** | `oral-comics` | 生成分镜脚本和 image prompt（文字部分完整） | 生成实际图片需要图像生成 API（DALL-E 3 / Stable Diffusion） |
| **声纹克隆** | `voice-clone-vc` | LLM 理解和文本生成正常 | 语音合成需要安装 `openvoice` 或 `cosyvoice`（含 PyTorch），或接入 ElevenLabs |

---

### 🔴 需要配置后才能使用

| Skill | 目录 | 缺少的配置 | 配置方式 |
|---|---|---|---|
| **情报简报** | `intel-briefing` | WebSearch 权限 | 在 Claude Code 设置中允许 WebSearch 工具 |
| **行程规划** | `trip-planner` | WebSearch 权限（搜索本地餐厅/景点实时信息） | 同上 |
| **语音合成** | `elevenlabs` | `ELEVENLABS_API_KEY` 环境变量 | 已配置则开箱即用；脚本位于 `elevenlabs/scripts/tts.py` |

---

## 各 Skill 详细说明

### weekly-report · 周览报告
将一周的零散记录整理成有结构、有洞察的周报。输入可以是每日日志、任务清单、会议摘要，输出包含本周主题、亮点成果、未竟事项、下周重点。

### work-reviewer · 进展复盘
把工作笔记或任务列表转化为阶段性复盘报告，按"战功"（可量化成果）和"内功"（协作/成长/流程改进）两个维度组织，以第一人称撰写，适合向上汇报或个人复盘。

### story-workshop · 故事工坊
把用户的真实经历、日常片段或想法，创作成有文学质感的叙事内容。支持小说章节、散文、短篇故事等多种形式，注重情感内核和细节描写。

### celebrity-chat · 名人对谈
基于公开资料模拟名人的思维方式，对你的会议内容或方案发表观点。支持乔布斯、马斯克、雷军等，支持多人物同时点评和持续追问。

### mindfulness-guide · 正念引导
识别用户的压力模式，生成定制化的冥想内容和呼吸练习（4-7-8 呼吸法、方框呼吸等），支持不同时长（2 分钟微休息 / 10 分钟深度放松）和不同目的（减压、专注、助眠）。

### letter-to-future · 给未来的信
生成一封写给未来自己的信，包含当前状态快照（工作、情绪、目标）和对未来的期许，记录时间节点和投递计划。

### negotiation-review · 谈判复盘器
分析谈判全过程，输出：谈判阶段时间线 → 对方策略图谱 → 我方表现评分 → 遗漏机会清单 → 下轮行动建议。

### emotional-palette · 情绪调色板
分析多个时间点的情绪数据，用颜色（情绪类型）和形状（强度/质地）描述情绪图谱，识别触发因素，提供情绪调节建议。

### personality-test-pro · 性格测试Pro
基于对话样本或自我描述，从语言模式、决策风格、社交偏好、情绪反应四个维度分析，交叉使用 MBTI、DISC、大五人格三个框架，输出深度性格报告和成长建议。

### career-coach · 职业教练
采用 GROW 模型（目标-现实-选择-行动），结合 NVC 和 DISC 框架，提供职业发展路径分析、沟通风格改善建议和 30/90/180 天行动计划。

### resume-generator · 简历生成
从工作经历描述中提炼 STAR 格式的简历素材，构建技能图谱，量化成就，针对目标岗位优化 ATS 关键词密度，支持技术/管理/创业等多版本输出。

### social-graph · 社交分析图谱
构建人物-项目-概念三维关系网络，分析互动频率和关系动态，识别断裂风险，输出按优先级排序的关系维护行动建议。

### ai-debate · AI辩论赛
用户选定话题和立场后，AI 扮演对方辩手，提供结构化的论点-论据-论证，支持多轮实时对练，结束后提供辩论评分和综合视角。

### annual-report · 年度述职
聚合全年工作记录，按 STAR 方法论组织项目成果，提取关键决策和方法论沉淀，生成完整的年度述职报告（含数据对比和成长轨迹）。

### opening-remarks · 开场白建议
在会议前，根据与对方的历史共同经历、关系亲密度和本次会议场景，生成自然得体的开场白（提供多个风格选项），并标注需要回避的话题。

### oral-comics · 口述漫画
将语言描述转化为 4-6 格漫画的完整分镜脚本，包含每格的画面描述、对话气泡文字和可直接提交给图像生成模型的 image prompt。需要额外的图像生成 API 来产出实际图片。

### voice-clone-vc · 声纹克隆
先用 LLM 处理用户需求（摘要/待办/报告），再用克隆声纹播报结果。语音合成部分需要安装 openvoice 或 cosyvoice，或改为通过 ElevenLabs API（`elevenlabs` skill）实现。

### intel-briefing · 情报简报
根据用户提供的话题或笔记，通过联网搜索生成结构化情报简报，包含核心焦点（最新动态）、延伸阅读（视野拓展）、每日必读（高价值资讯）。**需要 WebSearch 权限。**

### trip-planner · 行程规划
根据位置、时间、人数和偏好，搜索本地实时信息，生成包含具体餐厅/景点/活动推荐（含地址和理由）的可执行行程。**需要 WebSearch 权限。**

### elevenlabs · 语音合成
ElevenLabs 驱动的文字转语音工具，支持多声音、多语言、声音克隆、批量处理和音效生成。脚本位于 `elevenlabs/scripts/tts.py`，仅依赖 Python 标准库。**需要 `ELEVENLABS_API_KEY` 环境变量。**

---

## 依赖配置说明

### WebSearch 权限（intel-briefing、trip-planner）

在项目的 `.claude/settings.json` 中添加：

```json
{
  "permissions": {
    "allow": ["WebSearch"]
  }
}
```

### ElevenLabs API Key（elevenlabs、voice-clone-vc）

```bash
export ELEVENLABS_API_KEY=your_api_key_here
```

或添加到 `.env` 文件。

### 图像生成 API（oral-comics）

需要配置以下任一：
- `OPENAI_API_KEY`（DALL-E 3）
- Stable Diffusion API endpoint

### 声音克隆本地库（voice-clone-vc）

```bash
pip install openvoice  # 或
pip install cosyvoice
```

注：需要 PyTorch >= 2.0 和 soundfile >= 0.12。

---

## Skill 开发

新 skill 的目录结构：

```
skill-name/
├── SKILL.md          # 必须，包含 YAML frontmatter（name、description）和使用说明
└── scripts/          # 可选，确定性脚本（Python/Bash）
└── references/       # 可选，参考文档
└── assets/           # 可选，模板、图标等资源文件
```

使用 `skill-creator` skill 可以帮助创建、测试和优化新 skill：

```
/skill-creator 帮我创建一个 [描述你的 skill]
```
