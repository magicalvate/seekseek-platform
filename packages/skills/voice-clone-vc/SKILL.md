---
name: voice-clone-vc
description: "声纹克隆与语音合成技能：用30秒录音克隆任何人声音，支持情感语调控制、多语言、多格式输出。触发词：声纹克隆、百变声优、voice clone、tts、语音合成、请雷总播报、克隆声音、变声"
---

# 声纹克隆·百变声优 (Voice Clone & VC)

用30秒录音克隆任何人声音，让AI用你选择的声音说话。请雷总帮你播报待办，让乔布斯点评你的方案。

## 核心能力

1. **声纹克隆**：30秒音频提取声纹特征，零样本克隆
2. **多声音管理**：保存多个克隆声纹，随时切换
3. **情感语调**：支持6种情绪风格（正式/轻松/激动/悲伤/愤怒/温柔）
4. **多语言**：中文、英文、日文等120+语言
5. **输出格式**：MP3/WAV/OGG，支持流式播放

## 触发条件

当用户提到以下关键词时激活本Skill：
- 中文：声纹克隆、百变声优、克隆声音、变声、用XX的声音、请雷总播报、语音合成
- 英文：voice clone, tts, voice changer, clone voice, speak as

## 技术架构

```
用户语音输入（30秒样本）
    │
    ▼
┌─────────────────────────────────┐
│  声纹提取层                      │
│  ├── 音频预处理（降噪/标准化）    │
│  ├── 说话人嵌入（Speaker Embedding）│
│  └── 声纹特征存储                │
├─────────────────────────────────┤
│  语音合成层（TTS）               │
│  ├── 文本分析（分词/韵律预测）    │
│  ├── 声码器（Vocoder）           │
│  └── 情感风格控制                │
├─────────────────────────────────┤
│  输出层                          │
│  ├── 音频文件生成                │
│  ├── 流式播放                    │
│  └── 多格式导出                  │
└─────────────────────────────────┘
```

## 开源技术选型

| 方案 | 模型 | 优势 | 推荐场景 |
|------|------|------|---------|
| **OpenVoice v2** | MyShell-ai/OpenVoice | 轻量、<5秒推理、实时流式 | App内嵌、端侧 |
| **CosyVoice** | FunAudioLLM/CosyVoice | 中文最优、零样本克隆 | 中文场景 |
| **GPT-SoVITS v2** | RVC-Boss/GPT-SoVITS | 质量最高、情感丰富 | 云端高质量 |

## 工作流程

```python
# Step 1: 声纹提取
def extract_voiceprint(audio_path, min_duration=10):
    """从音频中提取声纹特征"""
    audio = load_audio(audio_path)
    audio = preprocess(audio)  # 降噪 + 标准化到16kHz
    embedding = speaker_encoder.encode(audio)
    return embedding

# Step 2: 语音合成
def synthesize_speech(text, voiceprint, emotion="neutral", speed=1.0):
    """使用克隆声纹合成语音"""
    # 文本分析
    tokens = tokenizer(text)
    prosody = predict_prosody(tokens, emotion)
    # 声码器合成
    audio = vocoder.generate(tokens, voiceprint, prosody, speed)
    return audio

# Step 3: 输出
def export_audio(audio, format="mp3", output_path=None):
    """导出音频文件"""
    if output_path is None:
        output_path = f"output_{int(time.time())}.{format}"
    save_audio(audio, output_path, format)
    return output_path
```

## 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `audio_path` | string | 必填 | 声纹样本音频路径（≥10秒） |
| `text` | string | 必填 | 要播报的文本内容 |
| `emotion` | enum | neutral | 情感风格：neutral/calm/happy/sad/angry/excited/gentle |
| `speed` | float | 1.0 | 语速倍率（0.5-2.0） |
| `format` | enum | mp3 | 输出格式：mp3/wav/ogg |
| `voice_name` | string | auto | 声纹名称（用于后续调用） |

## 使用示例

### 示例1：用雷军的声音播报待办

```
用户：用雷军的声音帮我播报今天的待办事项

助手：
1. 从录音库搜索雷军相关录音（采访/演讲片段）
2. 提取30秒最清晰片段作为声纹样本
3. 生成待办播报文本
4. 用雷军声纹 + gentle情感合成
5. 播放并保存为 voice_leijun_todo.mp3

输出：「今天有3个待办：第一，下午2点产品评审会；第二，晚上7点跟投资人吃饭；第三，睡前review明天的汇报PPT。加油，Are you OK？」
```

### 示例2：多声音对比播报

```
用户：用3种声音分别播报这段产品介绍

助手：
1. 加载3个已保存声纹（正式/轻松/活泼）
2. 分别合成同一段文本
3. 输出3个文件：formal.mp3, casual.mp3, lively.mp3
```

### 示例3：情绪控制

```
用户：用我自己的声音，温柔语气播报生日祝福

助手：
1. 提取用户声纹
2. 应用gentle情感参数
3. 合成语音 → birthday_wish.mp3
```

## 依赖要求

| 依赖 | 版本 | 说明 |
|------|------|------|
| Python | >=3.10 | 运行环境 |
| PyTorch | >=2.0 | 推理框架 |
| openvoice | >=2.0 | 声纹克隆 |
| cosyvoice | >=0.1 | 中文TTS（可选） |
| soundfile | >=0.12 | 音频IO |

## 与录音卡生态集成

- **录音库声纹提取**：从历史录音自动识别并保存说话人声纹
- **待办播报联动**：与日程Skill联动，自动生成播报
- **Dreaming推送**：每日总结用用户自己的声音推送
