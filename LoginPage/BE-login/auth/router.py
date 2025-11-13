from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from os import getenv
from .service import exchange_code_for_token, get_user_info

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

CLIENT_ID = getenv("AUTH_CLIENT_ID")
AUTHORIZE_URL = getenv("AUTH_AUTHORIZE_URL")
FRONTEND_URL = getenv("FRONTEND_URL")
REDIRECT_URI = getenv("AUTH_REDIRECT_URI")
LOGOUT_URL = getenv("AUTH_LOGOUT_URL")


@router.get("/login")
async def login():
    """
    Redirect người dùng sang trang đăng nhập Authentik
    """
    redirect_uri = (
        f"{AUTHORIZE_URL}?response_type=code"
        f"&client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope=openid email profile"
    )
    return RedirectResponse(url=redirect_uri)


@router.get("/callback")
async def callback(code: str):
    """
    Authentik gọi về đây sau khi user login xong.
    """
    token_data = await exchange_code_for_token(code)
    access_token = token_data.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="No access token received")

    user_info = await get_user_info(access_token)

    return JSONResponse({
        "access_token": access_token,
        "user": user_info
    })


@router.get("/logout")
async def logout():
    """
    Đăng xuất và xoá session Authentik
    """
    return RedirectResponse(url=f"{LOGOUT_URL}?next={FRONTEND_URL}")
