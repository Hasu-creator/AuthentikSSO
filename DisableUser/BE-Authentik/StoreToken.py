from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import uvicorn
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

from authentik_client import (
    disable_user_in_authentik,
    get_all_users_from_authentik,
    activate_user_in_authentik,
    get_inactive_users_from_authentik,
    edit_user_in_authentik
)

app = FastAPI(
    title="Authentik User Management API",
    description="API quản lý người dùng Authentik với filter admin users",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Authentik configuration
AUTHENTIK_URL = "https://ssotest.sctvdev.top"
CLIENT_ID = "pkxWjzEn9vFxesGg8Ovao2KW7pedvfG33ZtuahUd"

class LogoutRequest(BaseModel):
    token: Optional[str] = None
    username: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "token": "access_token_here",
                "username": "john.doe"
            }
        }

@app.post("/api/auth/logout")
def logout_user(payload: LogoutRequest):

    """Thu hồi token trên Authentik và trả về trạng thái."""
    try:
        if payload.token:
            revoke_url = f"{AUTHENTIK_URL}/application/o/revoke/"
            res = requests.post(
                revoke_url,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "token": payload.token,
                    "client_id": CLIENT_ID,
                },
                timeout=10,
                verify=False,
            )
            print(f"🔐 Revoke token status: {res.status_code}")
            print(f"📄 Body: {res.text}")
    except Exception as e:
        print(f"⚠️ Lỗi khi revoke token: {e}")

    return {"message": "Logout success"}
class AuthCallbackRequest(BaseModel):
    code: str
    verifier: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "code": "example_code_from_authentik",
                "verifier": "optional_pkce_verifier"
            }
        }

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3012",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174" 
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


class DisableUserRequest(BaseModel):
    username: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "john.doe"
            }
        }

class ActivateUserRequest(BaseModel):
    username: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "john.doe"
            }
        }

class EditUserRequest(BaseModel):
    username: str
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    new_username: Optional[str] = None  
    
    class Config:
        json_schema_extra = {
            "example": {
                "username": "john.doe",
                "name": "John Doe",
                "email": "john.doe@company.com",
                "new_username": "john.doe.new"
            }
        }

class SuccessResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

@app.get("/api/health", tags=["Health Check"])
async def health_check():
    return {
        "status": "ok",
        "message": "Backend is running with FastAPI",
        "version": "2.0.0"
    }

@app.post("/api/auth/callback", tags=["Authentication"])
async def auth_callback(request: AuthCallbackRequest):
    """
    Xử lý callback từ Authentik (đổi code lấy token)
    """
    print(f"📥 [FastAPI] Nhận callback từ FE: code={request.code}")

    # Gửi request đổi token tới Authentik
    payload = {
        "grant_type": "authorization_code",
        "code": request.code,
        "redirect_uri": "http://localhost:3012/auth/callback",
        "client_id": CLIENT_ID,
        "client_secret": "XgBaQf5tLwOovHGWpiwageHq0sq7vWMWbCT9F2KXlJh3lYblM74mT9G6mSaGnk11m6TAGxEuA1EwDSRgMAuiCLoEl739PdAtCp17MMgajOWHnnf26yepR9f2vHhBpOXJ",
    }

    # Nếu FE dùng PKCE
    if request.verifier:
        payload["code_verifier"] = request.verifier

    try:
        res = requests.post(AUTHENTIK_TOKEN_URL, data=payload, verify=False)
        AUTHENTIK_TOKEN_URL = f"{AUTHENTIK_URL}/application/o/token/"
        print(f"🔄 [FastAPI] Authentik token exchange: status={res.status_code}")
        data = res.json()

        if res.status_code != 200:
            print(f"❌ [FastAPI] Token exchange error: {data}")
            raise HTTPException(
                status_code=res.status_code,
                detail=data
            )

        print("✅ [FastAPI] Token nhận được:", data)
        return {"success": True, "token": data}

    except Exception as e:
        print(f"🔥 [FastAPI] Lỗi trong callback: {e}")
        raise HTTPException(status_code=500, detail="Lỗi xử lý callback từ Authentik")
@app.get("/api/users", tags=["Users"])
async def list_users():
    print("📥 [FastAPI] Nhận yêu cầu lấy danh sách users")
    
    success, result = get_all_users_from_authentik()
    
    if success:
        print(f"✅ [FastAPI] Trả về {len(result)} users")
        return result
    else:
        print(f"❌ [FastAPI] Lỗi: {result}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result
        )

@app.get("/api/users/inactive", tags=["Users"])
async def list_inactive_users():
    print("📥 [FastAPI] Nhận yêu cầu lấy danh sách users inactive")
    
    success, result = get_inactive_users_from_authentik()
    
    if success:
        print(f"✅ [FastAPI] Trả về {len(result)} users inactive")
        return result
    else:
        print(f"❌ [FastAPI] Lỗi: {result}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result
        )

@app.post("/api/disable_user", tags=["User Actions"], response_model=SuccessResponse)
async def disable_user(request: DisableUserRequest):
    username = request.username
    
    print(f"📥 [FastAPI] Nhận yêu cầu vô hiệu hóa: {username}")
    
    success, message = disable_user_in_authentik(username)
    
    if success:
        print(f"✅ [FastAPI] Vô hiệu hóa thành công: {username}")
        return {
            "success": True,
            "message": message
        }
    else:
        print(f"❌ [FastAPI] Vô hiệu hóa thất bại: {message}")
    
        if "protected admin" in message.lower() or "cannot disable" in message.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=message
            )
        elif "not found" in message.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=message
            )

@app.post("/api/activate_user", tags=["User Actions"], response_model=SuccessResponse)
async def activate_user(request: ActivateUserRequest):
    username = request.username
    
    print(f"📥 [FastAPI] Nhận yêu cầu kích hoạt: {username}")
    
    success, message = activate_user_in_authentik(username)
    
    if success:
        print(f"✅ [FastAPI] Kích hoạt thành công: {username}")
        return {
            "success": True,
            "message": message
        }
    else:
        print(f"❌ [FastAPI] Kích hoạt thất bại: {message}")
        
        if "protected admin" in message.lower() or "cannot activate" in message.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=message
            )
        elif "not found" in message.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=message
            )

@app.post("/api/edit_user", tags=["User Actions"])
async def edit_user(request: EditUserRequest):
    username = request.username
    update_data = {}
    
    if request.name:
        update_data['name'] = request.name
    if request.email:
        update_data['email'] = request.email
    
    if request.new_username:
        update_data['new_username'] = request.new_username
        print(f"🔄 [FastAPI] Yêu cầu đổi username: {username} → {request.new_username}")
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one field (name, email, or new_username) must be provided"
        )
    
    print(f"📥 [FastAPI] Nhận yêu cầu chỉnh sửa: {username}")
    print(f"📝 [FastAPI] Dữ liệu gửi xuống authentik_client: {update_data}")
    
    success, result = edit_user_in_authentik(username, update_data)
    
    if success:
        print(f"✅ [FastAPI] Chỉnh sửa thành công: {username}")
        print(f"📦 [FastAPI] Kết quả trả về: {result}")
        return {
            "success": True,
            "message": "User updated successfully",
            "user": result
        }
    else:
        print(f"❌ [FastAPI] Chỉnh sửa thất bại: {result}")
        
        if "protected admin" in result.lower() or "cannot edit" in result.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=result
            )
        elif "not found" in result.lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=result
            )
        elif "already exists" in result.lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=result
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result
            )
        
@app.on_event("startup")
async def startup_event():
    print("\n" + "="*60)
    print("🚀 FastAPI Backend Started Successfully!")
    print("="*60)
    print("📚 API Documentation: http://localhost:5000/api/docs")
    print("📖 ReDoc: http://localhost:5000/api/redoc")
    print("🔧 Health Check: http://localhost:5000/api/health")
    print("🔐 Logout Endpoint: http://localhost:5000/api/auth/logout")
    print("="*60)
    print("🔐 Protected Users: admin, akadmin, authentik")
    print("="*60 + "\n")

if __name__ == "__main__":
    uvicorn.run(
        "StoreToken:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    )