import httpx
from config import CLOUD_API_BASE, CLOUD_API_KEY, USE_MOCK
from mock_data import MOCK_SEARCH_RESPONSE, MOCK_DOWNLOAD_URL_RESPONSE


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


async def get_download_url(meeting_id: int) -> dict:
    if USE_MOCK:
        return MOCK_DOWNLOAD_URL_RESPONSE

    async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
        resp = await client.get(
            f"{CLOUD_API_BASE}/v1/recordings/{meeting_id}/download-url",
            headers={"Authorization": f"Bearer {CLOUD_API_KEY}"},
        )
        resp.raise_for_status()
        return resp.json()
