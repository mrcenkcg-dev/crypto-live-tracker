import sqlite3
import os
from datetime import datetime

DB_NAME = "shoulder_to_shoulder.db"

def init_db():
    """Initializes the SQLite database and creates necessary tables for tracking."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Table for tracking incoming mined content/links
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS mined_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_url TEXT UNIQUE,
            title TEXT,
            status TEXT DEFAULT 'pending',
            created_at TEXT
        )
    ''')
    
    # Table for logging user engagement metrics and traffic hits
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS engagement_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content_id INTEGER,
            interaction_type TEXT,
            timestamp TEXT,
            FOREIGN KEY (content_id) REFERENCES mined_content (id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized successfully.")

def log_mined_item(url, title):
    """Logs a newly mined item into the database."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT OR IGNORE INTO mined_content (source_url, title, created_at)
            VALUES (?, ?, ?)
        ''', (url, title, datetime.utcnow.isoformat()))
        conn.commit()
    except Exception as e:
        print(f"Error logging item: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    init_db()
