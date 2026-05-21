import json
import os
import re
from datetime import datetime
from mcp.server.fastmcp import FastMCP
from cloud_client import search, get_download_url
from config import get_save_dir, set_save_dir

mcp = FastMCP("ec-bridge")


@mcp.tool()
async def search_recordings(query: str) -> str:
    """
    Search the meeting records database using natural language and return
    matching meetings with relevant transcript excerpts.

    [When to call]
    Call this tool whenever the user expresses any of the following intents:
    - Find / retrieve / search meeting records, minutes, or recordings
    - Ask which meetings a specific person attended
    - Ask what happened during a time period
    - Ask about meetings related to a project or topic
    - Ask about decisions, action items, or attendees from a specific meeting

    [When NOT to call]
    Do not call when the user is discussing topics unrelated to meeting records
    (e.g. writing code, asking general technical questions).

    [Query rules]
    Pass the user's original question directly as the query — do not paraphrase or translate.
    Examples:
      User: "Which meetings did Alice attend last week?" → query="Which meetings did Alice attend last week?"
      User: "Find meetings about the budget"            → query="Find meetings about the budget"
      User: "What happened on May 12?"                 → query="What happened on May 12?"

    [Return value]
    - answer.meetings: list of matching meetings (title, time, participants, category)
    - chunks: relevant raw transcript excerpts (include meeting_id for follow-up retrieval)
    """
    result = await search(query=query)
    return json.dumps(result, ensure_ascii=False, indent=2)


@mcp.tool()
async def get_recording_download_url(meeting_id: int) -> str:
    """
    Get a temporary download link for a meeting recording (pre-signed URL, valid 15 minutes).

    [When to call]
    Call when the user wants to download, listen to, or access the raw audio file
    of a specific meeting. Typically called after search_recordings returns results
    and the user selects a meeting_id.

    [Where meeting_id comes from]
    Use the meeting_id field from chunks[] returned by search_recordings.
    Example: user says "download the recording for this meeting"
             → take meeting_id from the previous search result → call this tool.

    [Return value]
    - download_url: a directly accessible HTTPS link, valid for 15 minutes
    - expires_in: seconds until the link expires
    """
    result = await get_download_url(meeting_id=meeting_id)
    return json.dumps(result, ensure_ascii=False, indent=2)


@mcp.tool()
async def set_save_directory(path: str) -> str:
    """
    Set the default local directory for saving search results, persisted to config file.

    [When to call]
    Call when the user explicitly provides a directory path for saving results.
    Once set, this path becomes the default — subsequent saves will not ask again.

    [Path rules]
    Use the path exactly as the user provides it. Supports absolute paths and ~ expansion.
    """
    expanded = os.path.expanduser(path)
    os.makedirs(expanded, exist_ok=True)
    set_save_dir(expanded)
    return f"Save directory set to: {expanded}"


@mcp.tool()
async def save_search_result(data: str, query: str, filename: str = "") -> str:
    """
    Save raw JSON search results to a local file.

    [When to call]
    Call only when the user explicitly asks to save search results.
    If no save directory is configured, return a prompt asking the user
    to specify one via set_save_directory first.

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
