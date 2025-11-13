import httpx
import base64
from fastapi import HTTPException
from os import getenv

CLIENT_ID = getenv("AUTH_CLIENT_ID")
CLIENT_SECRET = getenv("AUTH_CLIENT_SECRET")
TOKEN_URL = getenv("AUTH_TOKEN_URL")
USERINFO_URL = getenv("AUTH_USERINFO_URL")
REDIRECT_URI = getenv("AUTH_REDIRECT_URI")


async def exchange_code_for_token(code: str):
    """
    Đổi authorization code từ Authentik thành access token.
    """
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(TOKEN_URL, data=data)
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Token exchange failed: {resp.text}")
        return resp.json()


async def get_user_info(access_token: str):
    """
    Lấy thông tin user từ Authentik /userinfo
    """
    headers = {"Authorization": f"Bearer {access_token}"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(USERINFO_URL, headers=headers)
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Userinfo failed: {resp.text}")
        return resp.json()
