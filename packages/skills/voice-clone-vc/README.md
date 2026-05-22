# 声纹克隆·百变声优

> 用30秒录音克隆任何人声音，让AI用你选择的声音说话。

## 快速开始

```bash
# 1. 从录音中提取声纹
python scripts/clone_voice.py clone recording.mp3 --name "雷军"

# 2. 用克隆声纹合成语音
python scripts/clone_voice.py synthesize "今天有3个待办" --voice "雷军" --emotion gentle

# 3. 列出已保存的声纹
python scripts/clone_voice.py list
```

## 技术栈

- **声纹克隆**: OpenVoice v2 / CosyVoice / GPT-SoVITS
- **语音合成**: VITS / VQ-GAN / BigVGAN
- **语言**: Python 3.10+
- **框架**: PyTorch 2.0+

## 目录结构

```
voice-clone-vc/
├── SKILL.md          # 技能定义（入口）
├── skill.json        # 元数据
├── README.md         # 本文件
├── scripts/          # 可执行脚本
│   └── clone_voice.py
├── src/              # 源代码
├── templates/        # 模板文件
├── tests/            # 测试
├── docs/             # 文档
└── examples/         # 示例
```

## 开源依赖

| 项目 | 用途 | 许可证 |
|------|------|--------|
| [OpenVoice](https://github.com/myshell-ai/OpenVoice) | 声纹克隆 | MIT |
| [CosyVoice](https://github.com/FunAudioLLM/CosyVoice) | 中文TTS | Apache-2.0 |
| [GPT-SoVITS](https://github.com/RVC-Boss/GPT-SoVITS) | 高质量TTS | MIT |
