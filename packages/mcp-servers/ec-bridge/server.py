import json
import os
import re
from datetime import datetime
from mcp.server.fastmcp import FastMCP
from cloud_client import search, fetch_transcripts as cloud_fetch_transcripts
from config import get_save_dir

mcp = FastMCP("ec-bridge")


@mcp.tool()
async def search_recordings(query: str) -> str:
    """
    Search the meeting records database using natural language and return
    matching meetings with relevant transcript excerpts. No files are written.

    [When to call]
    Use for browsing, Q&A, and previewing past meetings — when the user wants
    to find out what happened, who attended, or what was decided. Specifically:
    - "哪些会议讨论了 XX？"
    - "上周 Alice 参加了哪些会议？"
    - "XX 会议里做了哪些决定？"

    Do NOT call this when the user explicitly wants to save or download meeting
    content locally — use fetch_transcripts instead.

    [When NOT to call]
    - Scheduling or future meetings → use a calendar tool
    - User wants to save full transcripts to disk → use fetch_transcripts

    [Query rules]
    Pass the user's original question directly as the query — do not paraphrase or translate.

    [Return value]
    - answer.meetings: list of matching meetings (title, time, participants, category)
    - chunks: relevant transcript excerpts for answering the query
    """
    result = await search(query=query)
    return json.dumps(result, ensure_ascii=False, indent=2)


@mcp.tool()
async def fetch_transcripts(query: str) -> str:
    """
    Fetch full transcripts for meetings matching the query and save each as a
    .txt file to the local save directory. Use this when the user wants to
    persist meeting content to disk — not just browse or preview.

    [When to call]
    - "帮我把 XX 会议的源文件 / 原始文本拉下来"
    - "把跟 XX 相关的会议记录保存到本地"
    - "下载 XXX 主题的会议全文"
    - "帮我找一下关于 XX 的会议"

    [When NOT to call]
    For searching, Q&A, or previewing meeting content use search_recordings instead.
    Only call this when the user explicitly wants local files.

    [Return value]
    - meetings: list of meeting metadata + full transcript text
    - saved_files: list of absolute paths of the .txt files written
    """
    result = await cloud_fetch_transcripts(query=query)
    meetings: list = result if isinstance(result, list) else result.get("transcripts", [])

    save_dir = get_save_dir()
    saved_files = []
    skipped_files = []
    for meeting in meetings:
        meeting_title = meeting.get("meeting_title", "untitled")
        fulltext = meeting.get("fulltext", "")
        safe_name = re.sub(r'[^\w一-鿿\-]', '_', meeting_title)
        filepath = os.path.join(save_dir, f"{safe_name}.txt")
        if os.path.exists(filepath):
            skipped_files.append(filepath)
            continue
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(fulltext)
        saved_files.append(filepath)

    return json.dumps(
        {"meetings": meetings, "saved_files": saved_files, "skipped_files": skipped_files},
        ensure_ascii=False,
        indent=2,
    )


@mcp.tool()
async def save_search_result(data: str, query: str, filename: str = "") -> str:
    """
    Save raw JSON search results to a local file.

    [When to call]
    Call only when the user explicitly asks to save search results as JSON.
    For saving full transcript text use fetch_transcripts instead.

    [Parameters]
    - data: the JSON string to save (pass the return value of search_recordings directly)
    - query: the search query used, for generating the filename prefix
    - filename: optional custom filename (without extension); auto-generated as
                {query}_{timestamp}.json if omitted
    """
    save_dir = get_save_dir()
    if not save_dir:
        return "No save directory configured. Please tell me which folder to save files to."

    if filename:
        fname = f"{filename}.json"
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_query = re.sub(r'[^\w一-鿿]', '_', query)[:20]
        fname = f"{safe_query}_{timestamp}.json"

    filepath = os.path.join(save_dir, fname)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(data)

    return f"Saved to: {filepath}"


if __name__ == "__main__":
    mcp.run()
