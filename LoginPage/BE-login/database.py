# ============================================
# database.py - Database Configuration
# ============================================

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from typing import Generator
import os
from dotenv import load_dotenv

from models import Base

load_dotenv()

# ============================================
# Database URL Configuration
# ============================================

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./login.db"  # Default to SQLite for development
)

# For PostgreSQL production:
# DATABASE_URL = "postgresql://user:password@localhost:5432/login_db"

# ============================================
# Engine Configuration
# ============================================

if DATABASE_URL.startswith("sqlite"):
    # SQLite specific configuration
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=True  # Set to False in production
    )
else:
    # PostgreSQL or other databases
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        echo=True  # Set to False in production
    )

# ============================================
# Session Configuration
# ============================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ============================================
# Database Initialization
# ============================================

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

def drop_db():
    """Drop all database tables"""
    Base.metadata.drop_all(bind=engine)
    print("Database tables dropped!")

# ============================================
# Database Dependency
# ============================================

def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session
    Usage: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============================================
# Seed Data Function
# ============================================

def seed_initial_data(db: Session):
    """Seed initial data for testing"""
    from models import User, Application
    from passlib.context import CryptContext
    from datetime import datetime
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    # Check if users already exist
    existing_users = db.query(User).count()
    if existing_users > 0:
        print("Users already exist. Skipping seed.")
        return
    
    # Create admin user
    admin = User(
        username="admin",
        email="admin@example.com",
        password=pwd_context.hash("admin123"),
        name="Administrator",
        role="admin",
        is_active=True,
        is_verified=True,
        created_at=datetime.utcnow()
    )
    
    # Create regular user
    user = User(
        username="user",
        email="user@example.com",
        password=pwd_context.hash("user123"),
        name="Regular User",
        role="user",
        is_active=True,
        is_verified=True,
        created_at=datetime.utcnow()
    )
    
    db.add_all([admin, user])
    
    # Create sample applications
    apps = [
        Application(
            name="Email Portal",
            slug="email",
            description="Access your email",
            icon="📧",
            launch_url="https://mail.example.com",
            is_active=True
        ),
        Application(
            name="File Storage",
            slug="files",
            description="Manage your files",
            icon="📁",
            launch_url="https://files.example.com",
            is_active=True
        ),
        Application(
            name="Calendar",
            slug="calendar",
            description="View your schedule",
            icon="📅",
            launch_url="https://calendar.example.com",
            is_active=True
        ),
        Application(
            name="Chat",
            slug="chat",
            description="Team communication",
            icon="💬",
            launch_url="https://chat.example.com",
            is_active=True
        ),
        Application(
            name="Dashboard",
            slug="dashboard",
            description="View analytics",
            icon="📊",
            launch_url="https://dashboard.example.com",
            is_active=True
        ),
        Application(
            name="Settings",
            slug="settings",
            description="Manage preferences",
            icon="⚙️",
            launch_url="https://settings.example.com",
            is_active=True
        )
    ]
    
    db.add_all(apps)
    db.commit()
    
    print("Initial data seeded successfully!")
    print("Admin user: admin / admin123")
    print("Regular user: user / user123")