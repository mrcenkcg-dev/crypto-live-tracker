import os
import time
import random
import sqlite3
import requests
import ffmpeg
from datetime import datetime

# Configuration & Paths
OUTPUT_DIR = "./public/videos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

DB_PATH = "sovereign_engine.db"
# Allow dynamic override via environment variable, falling back to your live Render domain
SERVER_BASE_URL = os.environ.get("SOVEREIGN_SERVER_URL", "https://mrcenk.onrender.com")
API_ENDPOINT = f"{SERVER_BASE_URL}/api/log"

# Persistent session for efficient server telemetry pings
session = requests.Session()

# Cultural & Community Slogans for Autonomous Rotation
SLOGANS = [
    "Shoulder to Shoulder",
    "Anadolu Island • Living Network",
    "Get Big Together",
    "Sovereign Engine Active",
    "Anatolian Pulse & Digital Roots"
]

def render_dynamic_video_card(title_text, video_id):
    """Generates a procedural vertical video using lightweight FFmpeg filters with text overlays."""
    output_filename = f"video_{video_id}.mp4"
    output_filepath = os.path.join(OUTPUT_DIR, output_filename)
    
    print(f"🎬 Rendering vertical video card for: [{title_text}]")
    
    try:
        # Create a vertical 9:16 canvas (1080x1920) with a dark theme background and centered text
        (
            ffmpeg
            .input('color=c=0x18181b:s=1080x1920:d=5', f='lavfi')
            .drawtext(
                text=title_text,
                x='(w-text_w)/2',
                y='(h-text_h)/2',
                fontsize=52,
                fontcolor='white',
                shadowcolor='black',
                shadowx=3,
                shadowy=3
            )
            .output(output_filepath, pix_fmt='yuv420p', vcodec='libx264', r=25)
            .overwrite_output()
            .run(quiet=True)
        )
        print(f"✅ Rendered media asset: {output_filepath}")
        return f"/videos/{output_filename}"
    except ffmpeg.Error as e:
        print(f"❌ FFmpeg Render Error: {e.stderr.decode('utf8' if e.stderr else 'ascii') if hasattr(e, 'stderr') else e}")
        return None
    except Exception as e:
        print(f"❌ Unexpected Render Error: {e}")
        return None

def notify_server_all_platforms(content_tag):
    """Pings your Express server telemetry endpoint to update activity counters across all connected platforms."""
    platforms = ["youtube", "tiktok", "instagram", "facebook"]
    
    for channel in platforms:
        payload = {"channel": channel, "ad_count": 1, "content_tag": content_tag}
        try:
            response = session.post(API_ENDPOINT, json=payload, timeout=10)
            if response.status_code == 200:
                print(f"    ↳ Logged telemetry activity for {channel} on Render.")
            else:
                print(f"    ↳ Server response for {channel}: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"    ↳ Network error pinging server for {channel}: {e}")

def run_autonomous_cycle():
    """Executes a full generation, database injection, and telemetry notification cycle."""
    timestamp_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    title_text = random.choice(SLOGANS)
    description_text = f"Autonomous video generation loop executed live on worker. Tag: {title_text}"
    
    # 1. Render physical MP4 asset locally
    video_url_path = render_dynamic_video_card(title_text, timestamp_id)
    
    if video_url_path:
        # Construct full absolute URL if syncing with remote server, or relative path for local staging
        full_video_url = f"{SERVER_BASE_URL}{video_url_path}"

        # 2. Inject directly into local SQLite database so it populates the public /island portal grid instantly
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO media_streams (stream_type, title, description, video_url, platform_source)
                VALUES (?, ?, ?, ?, ?)
            """, ('grid', title_text, description_text, full_video_url, 'Sovereign Engine Worker'))
            conn.commit()
            conn.close()
            print("🚀 Successfully published rendered video record to SQLite database.")
        except sqlite3.Error as db_err:
            print(f"⚠️ Database insertion error: {db_err}")

        # 3. Notify remote Express server logs
        notify_server_all_platforms(title_text)
    else:
        print("⚠️ Skipping database injection due to render failure.")

if __name__ == "__main__":
    print("🚀 Starting autonomous multi-platform video generator worker...")
    
    # Run once immediately on startup
    run_autonomous_cycle()
    
    # Continuous hourly loop
    while True:
        print("⏳ Waiting for the next autonomous cycle (1 hour)...")
        time.sleep(3600)
        try:
            run_autonomous_cycle()
        except Exception as e:
            print(f"❌ Error in main loop execution: {e}")
