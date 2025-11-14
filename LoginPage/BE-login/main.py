from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

app = FastAPI()

# ========================
# CORS CONFIG
# ========================
origins = [
    "http://localhost:3012",
    "http://127.0.0.1:3012",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================
# AUTHENTIK CONFIG
# ========================
AUTHENTIK_URL = os.getenv("AUTHENTIK_URL", "https://ssotest.sctvdev.top")
CLIENT_ID = os.getenv("AUTH_CLIENT_ID", "H0EepVMpP8qazmCgV99PlCwuZX3HDfa0kqwd3h1C")
CLIENT_SECRET = os.getenv(
    "AUTH_CLIENT_SECRET",
    "fbimV8clhkuJoDEVyi0uco2aFtAOvY1k6F86aRP3fXGjRn55OBOm3yEVy97gomXQ8ouiiLHqQBwCNanuX6cBzp8CFmWKjp2o4JWCxrGswHkdNqQYUKFraE8TuwuYG3jd"
)

# ⚠️ Quan trọng: Phải khớp tuyệt đối với FE và Authentik Provider
REDIRECT_URI = os.getenv("AUTH_REDIRECT_URI", "http://localhost:3012/auth/callback")


# ========================
# PAYLOAD MODEL
# ========================
class CallbackPayload(BaseModel):
    code: str


# ========================
# TOKEN EXCHANGE & USERINFO
# ========================
@app.post("/api/auth/callback")
def callback(payload: CallbackPayload):
    token_url = f"{AUTHENTIK_URL}/application/o/token/"

    data = {
        "grant_type": "authorization_code",
        "code": payload.code,
        "redirect_uri": REDIRECT_URI,  # ✅ phải trùng với provider trong Authentik
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,  # ✅ DÙNG client_secret thay vì verifier
    }

    print("📤 [DEBUG] Sending token request to:", token_url)
    print("📦 Payload:", data)

    resp = requests.post(token_url, data=data, timeout=10)
    print("📥 [DEBUG] Response:", resp.status_code, resp.text)

    if resp.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Token exchange failed: {resp.text}")

    token_data = resp.json()
    access_token = token_data.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="No access token in response")

    userinfo_url = f"{AUTHENTIK_URL}/application/o/userinfo/"
    userinfo_resp = requests.get(
        userinfo_url,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10,
    )

    if userinfo_resp.status_code != 200:
        raise HTTPException(status_code=400, detail=f"Failed to get userinfo: {userinfo_resp.text}")

    user = userinfo_resp.json()

    out_user = {
        "username": user.get("preferred_username") or user.get("sub"),
        "email": user.get("email"),
        "name": user.get("name") or user.get("preferred_username"),
        "groups": user.get("groups", []),
        "is_superuser": user.get("is_superuser", False),
    }
    print("🚀 ACCESS TOKEN SENT TO FE:", access_token)

    return {"access_token": access_token, "user": out_user}
