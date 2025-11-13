#!/usr/bin/env python3
# ============================================
# manage.py - Database Management CLI
# ============================================

import argparse
import sys
from database import init_db, drop_db, get_db, seed_initial_data
from models import User, Application
from crud import create_user, get_users, create_application
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    init_db()
    print("✓ Database tables created successfully!")

def drop_tables():
    """Drop all database tables"""
    confirm = input("Are you sure you want to drop all tables? (yes/no): ")
    if confirm.lower() == "yes":
        print("Dropping database tables...")
        drop_db()
        print("✓ Database tables dropped successfully!")
    else:
        print("Operation cancelled.")

def seed_data():
    """Seed initial data"""
    print("Seeding initial data...")
    db = next(get_db())
    try:
        seed_initial_data(db)
        print("✓ Initial data seeded successfully!")
    finally:
        db.close()

def reset_database():
    """Reset database (drop and recreate)"""
    confirm = input("Are you sure you want to reset the database? All data will be lost! (yes/no): ")
    if confirm.lower() == "yes":
        print("Resetting database...")
        drop_db()
        init_db()
        db = next(get_db())
        try:
            seed_initial_data(db)
        finally:
            db.close()
        print("✓ Database reset successfully!")
    else:
        print("Operation cancelled.")

def create_admin():
    """Create a new admin user interactively"""
    print("\n=== Create Admin User ===")
    username = input("Username: ")
    email = input("Email: ")
    password = input("Password: ")
    name = input("Full Name: ")
    
    db = next(get_db())
    try:
        user = create_user(
            db=db,
            username=username,
            email=email,
            password=password,
            name=name,
            role="admin"
        )
        print(f"\n✓ Admin user '{user.username}' created successfully!")
        print(f"  ID: {user.id}")
        print(f"  Email: {user.email}")
    except Exception as e:
        print(f"✗ Error creating admin user: {e}")
    finally:
        db.close()

def list_users():
    """List all users"""
    db = next(get_db())
    try:
        users = get_users(db)
        
        if not users:
            print("No users found.")
            return
        
        print(f"\n{'ID':<36} {'Username':<20} {'Email':<30} {'Role':<10} {'Active'}")
        print("=" * 120)
        
        for user in users:
            print(f"{user.id:<36} {user.username:<20} {user.email:<30} {user.role:<10} {'Yes' if user.is_active else 'No'}")
        
        print(f"\nTotal users: {len(users)}")
    finally:
        db.close()

def generate_hash():
    """Generate bcrypt hash for a password"""
    password = input("Enter password to hash: ")
    hashed = pwd_context.hash(password)
    print(f"\nBcrypt hash: {hashed}")

def main():
    parser = argparse.ArgumentParser(description="Database Management CLI")
    
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Create tables
    subparsers.add_parser("init", help="Create database tables")
    
    # Drop tables
    subparsers.add_parser("drop", help="Drop all database tables")
    
    # Seed data
    subparsers.add_parser("seed", help="Seed initial data")
    
    # Reset database
    subparsers.add_parser("reset", help="Reset database (drop and recreate)")
    
    # Create admin
    subparsers.add_parser("create-admin", help="Create a new admin user")
    
    # List users
    subparsers.add_parser("list-users", help="List all users")
    
    # Generate hash
    subparsers.add_parser("hash", help="Generate bcrypt hash for a password")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    commands = {
        "init": create_tables,
        "drop": drop_tables,
        "seed": seed_data,
        "reset": reset_database,
        "create-admin": create_admin,
        "list-users": list_users,
        "hash": generate_hash
    }
    
    commands[args.command]()

if __name__ == "__main__":
    main()