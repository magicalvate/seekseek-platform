---
name: voice-clone-vc
description: "声纹克隆与语音合成技能：用30秒录音克隆任何人声音，支持情感语调控制、多语言、多格式输出。触发词：声纹克隆、百变声优、voice clone、tts、语音合成、请雷总播报、克隆声音、变声"
---

# 声纹克隆·百变声优 (Voice Clone & VC)

用30秒录音克隆任何人声音，让AI用你选择的声音说话。请雷总帮你播报待办，让乔布斯点评你的方案。

## 核心能力

1. **LLM理解+总结**：先处理用户需求（会议总结、待办提取、报告生成等）
2. **声纹克隆**：30秒音频提取声纹特征，零样本克隆
3. **TTS播报**：用克隆声纹播报LLM的处理结果
4. **多声音管理**：保存多个克隆声纹，随时切换
5. **情感语调**：支持6种情绪风格（正式/轻松/激动/悲伤/愤怒/温柔）
6. **多语言**：中文、英文、日文等120+语言
7. **客户端播放**：通过App/音箱等设备实时播放

## 触发条件

当用户提到以下关键词时激活本Skill：
- 中文：声纹克隆、百变声优、克隆声音、变声、用XX的声音、请雷总播报、语音合成
- 英文：voice clone, tts, voice changer, clone voice, speak as

## 用户体验流程（核心）

```
用户自然语言输入指令
    │
    ▼
模型提取需求（理解用户意图）
    │
    ▼
要求用户上传语音素材（如需要新声纹）
    │
    ▼
提取声纹（从素材中提取Speaker Embedding）
    │
    ▼
大模型执行理解和总结任务（LLM处理）
    │
    ▼
TTS合成播报内容（用克隆声纹）
    │
    ▼
通过客户端播放声音
```

<callout emoji="⚠️**核心逻辑**：声纹克隆不是终点，是「LLM处理结果」的播报通道。先让AI帮你干活（总结/提炼/生成），再用你选的声音把结果说出来。</callout>

## 技术架构

```
┌─────────────────────────────────┐
│  用户输入层                      │
│  ├── 自然语言指令                │
│  └── 语音素材上传（可选）         │
├─────────────────────────────────┤
│  需求理解层                      │
│  ├── 意图识别                    │
│  ├── 任务拆解                    │
│  └── 素材需求判断                │
├─────────────────────────────────┤
│  声纹提取层                      │
│  ├── 音频预处理（降噪/标准化）    │
│  ├── 说话人嵌入（Speaker Embedding）│
│  └── 声纹特征存储                │
├─────────────────────────────────┤
│  LLM处理层                       │
│  ├── 会议总结/待办提取            │
│  ├── 报告生成/数据分析            │
│  └── 任何文本处理任务             │
├─────────────────────────────────┤
│  TTS合成层                       │
│  ├── 文本分析（分词/韵律预测）    │
│  ├── 克隆声纹注入                │
│  ├── 情感风格控制                │
│  └── 声码器合成                   │
├─────────────────────────────────┤
│  输出层                          │
│  ├── 客户端实时播放              │
│  ├── 音频文件导出                │
│  └── 多格式支持（MP3/WAV/OGG）   │
└─────────────────────────────────┘
```

## 开源技术选型

| 方案 | 模型 | 优势 | 推荐场景 |
|------|------|------|---------|
| **OpenVoice v2** | MyShell-ai/OpenVoice | 轻量、<5秒推理、实时流式 | App内嵌、端侧 |
| **CosyVoice** | FunAudioLLM/CosyVoice | 中文最优、零样本克隆 | 中文场景 |
| **GPT-SoVITS v2** | RVC-Boss/GPT-SoVITS | 质量最高、情感丰富 | 云端高质量 |

## 工作流程（完整链路）

```python
# Step 1: 用户输入 + 需求理解
def process_user_request(user_input):
    """理解用户意图，判断是否需要声纹素材"""
    intent = llm_understand(user_input)
    if intent.needs_voiceprint and not has_saved_voiceprint(intent.voice_name):
        return {"action": "request_sample", "msg": "请上传一段30秒音频作为声纹素材"}
    return {"action": "proceed", "intent": intent}

# Step 2: 声纹提取（如需要新声纹）
def extract_voiceprint(audio_path, min_duration=10):
    """从音频中提取声纹特征"""
    audio = load_audio(audio_path)
    audio = preprocess(audio)  # 降噪 + 标准化到16kHz
    embedding = speaker_encoder.encode(audio)
    return {"embedding": embedding, "metadata": {...}}

# Step 3: LLM处理（核心任务）
def llm_process(intent, context):
    """执行用户需求：总结/提炼/生成"""
    result = llm.generate(prompt=intent.prompt, context=context)
    return result  # 返回处理后的文本

# Step 4: TTS合成（用克隆声纹）
def synthesize_speech(text, voiceprint, emotion="neutral", speed=1.0):
    """使用克隆声纹合成语音"""
    tokens = tokenizer(text)
    prosody = predict_prosody(tokens, emotion)
    audio = vocoder.generate(tokens, voiceprint, prosody, speed)
    return audio

# Step 5: 客户端播放
def play_on_client(audio, device="phone"):
    """通过客户端播放音频"""
    if device == "phone":
        send_to_app(audio)
    elif device == "speaker":
        send_to_xiaoai(audio)
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

### 示例1：用雷军的声音播报会议总结

```
用户：用雷军的声音帮我总结刚才的录音

助手：
1. 提取需求：用户想用雷军声音播报会议总结
2. 检查声纹库：雷军声纹已保存（来自采访录音）
3. LLM处理：读取录音转写 → 生成结构化会议总结
4. TTS合成：雷军声纹 + calm情感
5. 客户端播放

输出语音：「刚才的会议有3个关键决策：第一，Q3预算确定为500万；第二，录音卡项目6月底正式立项；第三，WPS对接下周完成。建议你今天下午先把预算方案发给张总review。」
```

### 示例2：总结录音并用克隆声音播报

```
用户：总结这段客户会议，用我的声音读给我听

助手：
1. 提取需求：总结会议 + 用用户声音播报
2. 检查声纹库：用户声纹已保存
3. LLM处理：分析录音 → 提取客户关注点、我方承诺、后续行动
4. TTS合成：用户声纹 + neutral情感
5. 客户端播放

输出语音：「客户这次主要关注3个问题：价格能不能再降5%、交付时间能不能提前到10月、售后响应时间能不能缩短到2小时。你承诺了本周五前给报价，记得跟进。」
```

### 示例3：声纹克隆 + 报告生成

```
用户：克隆这段录音里的人的声音，然后用这个声音读一份工作报告

助手：
1. 提取需求：克隆声纹 + 生成报告 + 播报
2. 要求上传素材：「请上传一段30秒以上的音频」
3. 声纹提取：从上传的音频中提取Speaker Embedding
4. LLM处理：基于录音内容生成工作报告
5. TTS合成：用新克隆的声纹播报报告
6. 客户端播放
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
