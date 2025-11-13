# ============================================
# crud.py - CRUD Operations for Database
# ============================================

from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, timedelta
from passlib.context import CryptContext

from models import User, Session as SessionModel, Application, ApplicationPermission, AuditLog

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ============================================
# User CRUD Operations
# ============================================

def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    """Get user by ID"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get user by username"""
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    """Get all users with pagination"""
    return db.query(User).offset(skip).limit(limit).all()

def create_user(
    db: Session,
    username: str,
    email: str,
    password: str,
    name: str,
    role: str = "user"
) -> User:
    """Create a new user"""
    hashed_password = pwd_context.hash(password)
    
    user = User(
        username=username,
        email=email,
        password=hashed_password,
        name=name,
        role=role,
        is_active=True,
        is_verified=False,
        created_at=datetime.utcnow()
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

def update_user(db: Session, user_id: str, **kwargs) -> Optional[User]:
    """Update user information"""
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    
    for key, value in kwargs.items():
        if hasattr(user, key) and value is not None:
            if key == "password":
                value = pwd_context.hash(value)
            setattr(user, key, value)
    
    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    return user

def delete_user(db: Session, user_id: str) -> bool:
    """Delete a user"""
    user = get_user_by_id(db, user_id)
    if not user:
        return False
    
    db.delete(user)
    db.commit()
    
    return True

def update_last_login(db: Session, user_id: str):
    """Update user's last login timestamp"""
    user = get_user_by_id(db, user_id)
    if user:
        user.last_login = datetime.utcnow()
        db.commit()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

# ============================================
# Session CRUD Operations
# ============================================

def create_session(
    db: Session,
    user_id: str,
    token: str,
    expires_at: datetime,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> SessionModel:
    """Create a new session"""
    session = SessionModel(
        user_id=user_id,
        token=token,
        ip_address=ip_address,
        user_agent=user_agent,
        created_at=datetime.utcnow(),
        expires_at=expires_at,
        is_valid=True
    )
    
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return session

def get_session_by_token(db: Session, token: str) -> Optional[SessionModel]:
    """Get session by token"""
    return db.query(SessionModel).filter(
        SessionModel.token == token,
        SessionModel.is_valid == True,
        SessionModel.expires_at > datetime.utcnow()
    ).first()

def invalidate_session(db: Session, token: str) -> bool:
    """Invalidate a session"""
    session = db.query(SessionModel).filter(SessionModel.token == token).first()
    if not session:
        return False
    
    session.is_valid = False
    db.commit()
    
    return True

def invalidate_user_sessions(db: Session, user_id: str) -> int:
    """Invalidate all sessions for a user"""
    count = db.query(SessionModel).filter(
        SessionModel.user_id == user_id,
        SessionModel.is_valid == True
    ).update({"is_valid": False})
    
    db.commit()
    return count

def cleanup_expired_sessions(db: Session) -> int:
    """Remove expired sessions"""
    count = db.query(SessionModel).filter(
        SessionModel.expires_at < datetime.utcnow()
    ).delete()
    
    db.commit()
    return count

# ============================================
# Application CRUD Operations
# ============================================

def get_applications(db: Session, skip: int = 0, limit: int = 100) -> List[Application]:
    """Get all active applications"""
    return db.query(Application).filter(
        Application.is_active == True
    ).offset(skip).limit(limit).all()

def get_application_by_id(db: Session, app_id: str) -> Optional[Application]:
    """Get application by ID"""
    return db.query(Application).filter(Application.id == app_id).first()

def get_application_by_slug(db: Session, slug: str) -> Optional[Application]:
    """Get application by slug"""
    return db.query(Application).filter(Application.slug == slug).first()

def create_application(
    db: Session,
    name: str,
    slug: str,
    launch_url: str,
    description: Optional[str] = None,
    icon: Optional[str] = None
) -> Application:
    """Create a new application"""
    app = Application(
        name=name,
        slug=slug,
        launch_url=launch_url,
        description=description,
        icon=icon,
        is_active=True,
        created_at=datetime.utcnow()
    )
    
    db.add(app)
    db.commit()
    db.refresh(app)
    
    return app

def update_application(db: Session, app_id: str, **kwargs) -> Optional[Application]:
    """Update application"""
    app = get_application_by_id(db, app_id)
    if not app:
        return None
    
    for key, value in kwargs.items():
        if hasattr(app, key) and value is not None:
            setattr(app, key, value)
    
    app.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(app)
    
    return app

def delete_application(db: Session, app_id: str) -> bool:
    """Delete an application"""
    app = get_application_by_id(db, app_id)
    if not app:
        return False
    
    db.delete(app)
    db.commit()
    
    return True

def get_user_applications(db: Session, user_id: str, role: str) -> List[Application]:
    """Get applications accessible by user based on role"""
    # Get all active applications
    apps = db.query(Application).filter(Application.is_active == True).all()
    
    # If admin, return all apps
    if role == "admin":
        return apps
    
    # For regular users, filter by permissions
    # This is a simplified version - implement more complex logic as needed
    return apps

# ============================================
# Application Permission CRUD Operations
# ============================================

def grant_application_permission(
    db: Session,
    application_id: str,
    user_id: Optional[str] = None,
    role: Optional[str] = None
) -> ApplicationPermission:
    """Grant application permission to user or role"""
    permission = ApplicationPermission(
        application_id=application_id,
        user_id=user_id,
        role=role,
        granted_at=datetime.utcnow()
    )
    
    db.add(permission)
    db.commit()
    db.refresh(permission)
    
    return permission

def revoke_application_permission(db: Session, permission_id: str) -> bool:
    """Revoke application permission"""
    permission = db.query(ApplicationPermission).filter(
        ApplicationPermission.id == permission_id
    ).first()
    
    if not permission:
        return False
    
    db.delete(permission)
    db.commit()
    
    return True

def check_application_access(
    db: Session,
    application_id: str,
    user_id: str,
    role: str
) -> bool:
    """Check if user has access to application"""
    # Admins have access to everything
    if role == "admin":
        return True
    
    # Check specific user permission
    permission = db.query(ApplicationPermission).filter(
        ApplicationPermission.application_id == application_id,
        ApplicationPermission.user_id == user_id
    ).first()
    
    if permission:
        return True
    
    # Check role-based permission
    permission = db.query(ApplicationPermission).filter(
        ApplicationPermission.application_id == application_id,
        ApplicationPermission.role == role
    ).first()
    
    return permission is not None

# ============================================
# Audit Log CRUD Operations
# ============================================

def create_audit_log(
    db: Session,
    action: str,
    user_id: Optional[str] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    details: Optional[str] = None
) -> AuditLog:
    """Create an audit log entry"""
    log = AuditLog(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        ip_address=ip_address,
        user_agent=user_agent,
        details=details,
        created_at=datetime.utcnow()
    )
    
    db.add(log)
    db.commit()
    db.refresh(log)
    
    return log

def get_audit_logs(
    db: Session,
    user_id: Optional[str] = None,
    action: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
) -> List[AuditLog]:
    """Get audit logs with optional filters"""
    query = db.query(AuditLog)
    
    if user_id:
        query = query.filter(AuditLog.user_id == user_id)
    
    if action:
        query = query.filter(AuditLog.action == action)
    
    return query.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()