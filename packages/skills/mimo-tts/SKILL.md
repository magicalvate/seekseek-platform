---
name: MiMo 语音合成
description: "MiMo V2.5 text-to-speech — convert text to natural-sounding audio using Xiaomi's MiMo V2.5 TTS API. Use this skill whenever the agent needs to: generate spoken audio from text, narrate documents, produce voiceovers, create a custom voice from a text description (voice design), or clone a voice from an audio sample. Supports natural-language style control, three output formats (wav/mp3/pcm16), and three operating modes: preset voice, AI voice design, and voice cloning. Requires MIMO_API_KEY."
icon: "🎙️"
author: seekseek
tags:
  - mimo-tts
tools: []
examples:
  - 帮我把这段文字转成语音
  - 用冰糖的声音朗读这段内容
  - 克隆这个声音并说一段话
---

# MiMo V2.5 — Text-to-Speech

Xiaomi MiMo V2.5 powered audio generation. Three modes: preset voice TTS, voice design from text description, and voice cloning from an audio sample.

---

## Setup

**Required env var:** `MIMO_API_KEY`

The CLI script at `scripts/tts.py` uses only Python stdlib (`urllib`, `base64`, `json`, `argparse`) — no pip dependencies.

---

## Quick Reference

All commands use:

```bash
python skills/mimo-tts/scripts/tts.py <command> [args]
```

### speak — Preset voice TTS

```bash
# Basic — default voice
python scripts/tts.py speak "Hello, welcome to our product."

# With style instruction (natural language, not spoken)
python scripts/tts.py speak "本季度超额完成了所有目标。" \
  --style "confident and enthusiastic presenter tone"

# Chinese voices
python scripts/tts.py speak "你好，欢迎使用我们的产品。" --voice 冰糖
python scripts/tts.py speak "大家好，今天我们来聊一聊AI。" --voice 苏打

# English voices
python scripts/tts.py speak "Welcome to our service." --voice Chloe
python scripts/tts.py speak "Good morning, here is your briefing." --voice Dean

# From a file
python scripts/tts.py speak @report.txt -o report.wav

# From stdin
echo "Dynamic content" | python scripts/tts.py speak -

# WAV / PCM output
python scripts/tts.py speak "Studio quality." --format pcm16 -o voice.pcm
```

**Preset voices:**

| Voice | Language | Gender |
|-------|----------|--------|
| `冰糖` | Chinese | Female |
| `茉莉` | Chinese | Female |
| `苏打` | Chinese | Male |
| `白桦` | Chinese | Male |
| `Mia` | English | Female |
| `Chloe` | English | Female |
| `Milo` | English | Male |
| `Dean` | English | Male |
| `mimo_default` | Auto | — |

### design — Generate a new voice from text description

The model synthesizes a brand-new voice matching your description — no audio sample needed.

```bash
# Describe the voice, provide the text to speak
python scripts/tts.py design "Welcome to our service." \
  --voice-desc "A warm, friendly female voice with a slight British accent"

# More expressive description
python scripts/tts.py design "Chapter one begins." \
  --voice-desc "Deep, authoritative male narrator, slow and deliberate, like a documentary" \
  -o chapter1.wav

# From file
python scripts/tts.py design @article.txt \
  --voice-desc "Energetic young woman, conversational podcast style" \
  --format mp3 -o podcast.mp3
```

### clone — Clone a voice from a reference audio sample

Provide an audio file of the target speaker; the model reproduces that voice.

```bash
# Clone from a wav sample
python scripts/tts.py clone "Hello, this is a cloned voice." \
  --sample reference_speaker.wav

# Clone from mp3, save to specific path
python scripts/tts.py clone @script.txt \
  --sample ceo_recording.mp3 \
  -o personalized_message.wav

# MP3 output
python scripts/tts.py clone "Greetings from our team." \
  --sample sample.wav --format mp3 -o greeting.mp3
```

---

## Models

| Mode | Model | When to use |
|------|-------|-------------|
| `speak` | `mimo-v2.5-tts` | Quick TTS with built-in voices and style control |
| `design` | `mimo-v2.5-tts-voicedesign` | Need a specific timbre — describe it in plain language |
| `clone` | `mimo-v2.5-tts-voiceclone` | Need to reproduce a real person's voice from samples |

---

## Output Formats

| Format | Description |
|--------|-------------|
| `wav` | Uncompressed — best quality, larger file (default) |
| `mp3` | Compressed — good for delivery, smaller file |
| `pcm16` | Raw PCM 16-bit — for audio pipelines and post-processing |

---

## Style Guide (speak mode)

The `--style` parameter is a natural-language delivery instruction passed to the model before the speech text. The model uses it to shape tone, pace, and emotion — it is not spoken aloud.

**Examples:**

```
--style "slow and deliberate, like reading a bedtime story"
--style "upbeat and energetic, like a sports commentator"
--style "calm and reassuring, customer service tone"
--style "dramatic and suspenseful, documentary narrator"
--style "fast-paced, enthusiastic tech demo presentation"
```

---

## Voice Design Guide (design mode)

`--voice-desc` describes the voice timbre itself — gender, age, accent, texture, pace. Think of it as directing a casting call.

**Examples:**

```
--voice-desc "Middle-aged British male, warm and trustworthy, like a BBC anchor"
--voice-desc "Young Chinese female, cheerful and energetic, slight Mandarin accent"
--voice-desc "Elderly gravelly male voice, slow and wise, storytelling register"
--voice-desc "Gender-neutral, smooth and robotic, slightly futuristic"
```

---

## Common Workflows

### Narrate a document

```bash
python scripts/tts.py speak @workspace/report.md \
  --style "professional presenter, clear and measured" \
  -o report_narration.wav
```

### Create a podcast intro

```bash
python scripts/tts.py design \
  "Welcome to the show. Today we explore the future of AI." \
  --voice-desc "Energetic male host, American accent, conversational and warm" \
  --format mp3 -o intro.mp3
```

### Personalize a message with voice cloning

```bash
python scripts/tts.py clone \
  "Hi team, great work this week. See you on Monday." \
  --sample manager_voice.wav \
  -o weekly_message.wav
```

---

## API Notes

- **Endpoint:** `POST https://api.xiaomimimo.com/v1/chat/completions` (OpenAI-compatible)
- **Auth:** `api-key` header
- **Text placement:** Speech text always goes in the `assistant` role message. The `user` role carries style/description instructions only — it is never spoken.
- **Response:** Base64-encoded audio returned in `choices[0].message.audio.data`
- **Free tier:** TTS is currently free during Xiaomi's beta period.

---

## Env Vars

| Variable | Required | Description |
|----------|----------|-------------|
| `MIMO_API_KEY` | Yes | Your MiMo API key from platform.xiaomimimo.com |
| `VOICE_TTS_DIR` | No | Default output directory (defaults to `~/voice_tts`) |
