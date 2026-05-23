import httpx
from config import CLOUD_API_BASE, CLOUD_API_KEY, USE_MOCK
from mock_data import MOCK_SEARCH_RESPONSE, MOCK_FETCH_TRANSCRIPTS_RESPONSE


async def search(query: str, top_k: int = 5) -> dict:
    if USE_MOCK:
        return MOCK_SEARCH_RESPONSE

    async with httpx.AsyncClient(timeout=120, follow_redirects=True) as client:
        resp = await client.post(
            f"{CLOUD_API_BASE}/query",
            json={"question": query, "top_k": top_k},
        )
        resp.raise_for_status()
        return resp.json()


async def fetch_transcripts() -> list:
    if USE_MOCK:
        return MOCK_FETCH_TRANSCRIPTS_RESPONSE

    async with httpx.AsyncClient(timeout=120, follow_redirects=True) as client:
        resp = await client.get(
            f"{CLOUD_API_BASE}/fetch_transcripts",
        )
        resp.raise_for_status()
        return resp.json()


