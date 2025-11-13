# main.py
import os
import logging
from typing import Optional
import httpx
from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("portal-be")
logging.basicConfig(level=logging.INFO)

AUTHENTIK_URL = os.getenv("AUTHENTIK_URL", "https://ssotest.sctvdev.top")
# endpoint to fetch user's library (Authentik)
LIBRARY_ENDPOINT = f"{AUTHENTIK_URL}/api/v3/core/applications/library/"

app = FastAPI(title="Portal BE (Proxy for Authentik library)")

# allow FE origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://localhost:5173",
        "http://127.0.0.1:5174",
        "http://localhost:3012"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.get("/api/applications")
async def get_applications(
    authorization: Optional[str] = Header(None),
    token: Optional[str] = Query(None),
    access_token: Optional[str] = Query(None),
):
    """
    Proxy to Authentik /applications/library/
    Accepts:
      - Authorization header "Bearer <token>"
      - ?access_token=...
      - ?token=... (legacy)
    """
    # chọn token: header > access_token query > token query
    access = None
    if authorization and authorization.startswith("Bearer "):
        access = authorization.split(" ", 1)[1].strip()
    elif access_token:
        access = access_token
    elif token:
        access = token

    if not access:
        raise HTTPException(status_code=401, detail="Missing access token")

    headers = {"Authorization": f"Bearer {access}"}
    async with httpx.AsyncClient(verify=True, timeout=15) as client:
        resp = await client.get(LIBRARY_ENDPOINT, headers=headers)

    if resp.status_code != 200:
        logger.warning("Authentik library returned %s", resp.status_code)
        # trả lỗi cho FE kèm message từ Authentik (đã serialize)
        raise HTTPException(status_code=resp.status_code, detail=f"Failed to fetch library: {resp.text}")

    data = resp.json()
    results = []
    for a in data.get("results", []):
        results.append({
            "name": a.get("name"),
            "slug": a.get("slug"),
            "launch_url": a.get("launch_url"),
            "icon": a.get("meta_icon"),
            "description": a.get("description"),
            "provider": (a.get("provider") or {}).get("name") if a.get("provider") else None,
        })

    return JSONResponse({"applications": results})
@app.get("/api/health")
async def health():
    return {"status": "ok"}
