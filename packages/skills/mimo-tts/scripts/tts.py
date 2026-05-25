#!/usr/bin/env python3
"""
MiMo V2.5 TTS CLI

Usage:
  python tts.py speak "Hello world"
  python tts.py speak "Hello world" --voice mimo_default --style "warm and friendly"
  python tts.py speak @article.txt -o narration.wav
  python tts.py speak - < input.txt

  python tts.py design "Hello world" --voice-desc "A calm, deep male voice with slight echo"
  python tts.py design @script.txt --voice-desc "Cheerful young woman" --format mp3

  python tts.py clone "Hello world" --sample reference.wav
  python tts.py clone @text.txt --sample voice_sample.mp3 -o output.wav

Env: MIMO_API_KEY (required)
"""

import argparse
import base64
import json
import mimetypes
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

API_BASE = "https://api.xiaomimimo.com/v1"
DEFAULT_OUTPUT_DIR = Path(os.environ.get("VOICE_TTS_DIR", Path.home() / "voice_tts"))


def get_api_key() -> str:
    key = os.environ.get("MIMO_API_KEY")
    if not key:
        print("ERROR: MIMO_API_KEY environment variable not set", file=sys.stderr)
        sys.exit(1)
    return key


def api_request(body: dict) -> dict:
    key = get_api_key()
    url = f"{API_BASE}/chat/completions"
    headers = {
        "api-key": key,
        "Content-Type": "application/json",
    }
    data = json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        try:
            msg = json.loads(error_body).get("error", {}).get("message", error_body)
        except Exception:
            msg = error_body
        print(f"ERROR [{e.code}]: {msg}", file=sys.stderr)
        sys.exit(1)


def extract_audio(resp: dict) -> bytes:
    try:
        audio_b64 = resp["choices"][0]["message"]["audio"]["data"]
        return base64.b64decode(audio_b64)
    except (KeyError, IndexError) as e:
        print(f"ERROR: Unexpected response format: {e}", file=sys.stderr)
        print(f"Response: {json.dumps(resp, indent=2)}", file=sys.stderr)
        sys.exit(1)


def read_text(text_arg: str) -> str:
    if text_arg == "-":
        return sys.stdin.read().strip()
    if text_arg.startswith("@"):
        return Path(text_arg[1:]).read_text(encoding="utf-8").strip()
    return text_arg


def save_audio(audio: bytes, output: str | None, fmt: str, default_name: str) -> None:
    ext = "wav" if fmt == "pcm16" else fmt
    out_path = Path(output) if output else DEFAULT_OUTPUT_DIR / f"{default_name}.{ext}"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_bytes(audio)
    print(f"Audio saved: {out_path} ({len(audio):,} bytes)")


# ── Commands ──────────────────────────────────────────────────────────────────


def cmd_speak(args: argparse.Namespace) -> None:
    """TTS with a preset voice ID. Optionally guide delivery with --style."""
    text = read_text(args.text)
    if not text:
        print("ERROR: No text provided", file=sys.stderr)
        sys.exit(1)

    fmt = args.format or "wav"
    messages = []
    if args.style:
        # User role carries delivery instructions; they are not spoken aloud
        messages.append({"role": "user", "content": args.style})
    messages.append({"role": "assistant", "content": text})

    body = {
        "model": "mimo-v2.5-tts",
        "messages": messages,
        "audio": {
            "format": fmt,
            "voice": args.voice or "mimo_default",
        },
    }

    resp = api_request(body)
    audio = extract_audio(resp)
    save_audio(audio, args.output, fmt, "speech_output")


def cmd_design(args: argparse.Namespace) -> None:
    """Generate a brand-new voice from a text description, then speak."""
    text = read_text(args.text)
    if not text:
        print("ERROR: No text provided", file=sys.stderr)
        sys.exit(1)

    fmt = args.format or "wav"
    body = {
        "model": "mimo-v2.5-tts-voicedesign",
        "messages": [
            # User role = voice description (not spoken)
            {"role": "user", "content": args.voice_desc},
            # Assistant role = actual speech text
            {"role": "assistant", "content": text},
        ],
        "audio": {"format": fmt},
    }

    resp = api_request(body)
    audio = extract_audio(resp)
    save_audio(audio, args.output, fmt, "design_output")


def cmd_clone(args: argparse.Namespace) -> None:
    """Clone a voice from a reference audio file, then speak."""
    text = read_text(args.text)
    if not text:
        print("ERROR: No text provided", file=sys.stderr)
        sys.exit(1)

    sample_path = Path(args.sample)
    if not sample_path.exists():
        print(f"ERROR: Sample file not found: {sample_path}", file=sys.stderr)
        sys.exit(1)

    mime = mimetypes.guess_type(str(sample_path))[0] or "audio/wav"
    audio_b64 = base64.b64encode(sample_path.read_bytes()).decode()
    voice_uri = f"data:{mime};base64,{audio_b64}"

    fmt = args.format or "wav"
    body = {
        "model": "mimo-v2.5-tts-voiceclone",
        "messages": [
            {"role": "assistant", "content": text},
        ],
        "audio": {
            "format": fmt,
            "voice": voice_uri,
        },
    }

    resp = api_request(body)
    audio = extract_audio(resp)
    save_audio(audio, args.output, fmt, "clone_output")


# ── CLI Parser ────────────────────────────────────────────────────────────────


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="tts",
        description="MiMo V2.5 Text-to-Speech CLI",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # speak
    p_speak = sub.add_parser("speak", help="Convert text to speech with a preset voice")
    p_speak.add_argument("text", help="Text to speak ('-' for stdin, '@file.txt' to read from file)")
    p_speak.add_argument("-o", "--output", help="Output file path")
    p_speak.add_argument("--voice", default="mimo_default", help="Voice ID (default: mimo_default)")
    p_speak.add_argument("--style", help="Delivery style in natural language, e.g. 'slow and dramatic'")
    p_speak.add_argument("--format", choices=["wav", "mp3", "pcm16"], default="wav", help="Output format")

    # design
    p_design = sub.add_parser("design", help="Design a new voice from a text description")
    p_design.add_argument("text", help="Text to speak ('-' for stdin, '@file.txt' to read from file)")
    p_design.add_argument("--voice-desc", required=True,
                          help="Natural-language description of the desired voice")
    p_design.add_argument("-o", "--output", help="Output file path")
    p_design.add_argument("--format", choices=["wav", "mp3", "pcm16"], default="wav", help="Output format")

    # clone
    p_clone = sub.add_parser("clone", help="Clone a voice from a reference audio sample")
    p_clone.add_argument("text", help="Text to speak ('-' for stdin, '@file.txt' to read from file)")
    p_clone.add_argument("--sample", required=True, help="Reference audio file path (wav/mp3/etc.)")
    p_clone.add_argument("-o", "--output", help="Output file path")
    p_clone.add_argument("--format", choices=["wav", "mp3", "pcm16"], default="wav", help="Output format")

    args = parser.parse_args()
    {"speak": cmd_speak, "design": cmd_design, "clone": cmd_clone}[args.command](args)


if __name__ == "__main__":
    main()
