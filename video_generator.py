import os
import time
import requests
from moviepy.editor import TextClip, ColorClip, CompositeVideoClip

# Initialize a persistent session for efficient server pings
session = requests.Session()
SERVER_URL = "https://mrcenk.onrender.com/api/log"

# Cultural & Community Slogans for Autonomous Rotation
SLOGANS = [
    "Shoulder to Shoulder",
    "Anadolu Island • Living Network",
    "Get Big Together",
    "Sovereign Engine Active",
    "Anatolian Pulse & Digital Roots"
]

def generate_short_video(output_filename="output_short.mp4", text_message=None):
    print("🎬 Generating vertical short video...")
    
    if not text_message:
        # Automatically rotate through slogans on each run
        import random
        text_message = random.choice(SLOGANS)

    try:
        # 1. Create a dark background clip (Vertical 9:16 ratio for Shorts/Reels/TikTok: 1080x1920)
        background = ColorClip(size=(1080, 1920), color=(15, 15, 25), duration=5)
        
        # 2. Create text overlay (Ensure ImageMagick is configured on your host environment)
        txt_clip = TextClip(
            text_message, 
            fontsize=65, 
            color='white', 
            size=(960, None), 
            method='caption'
        ).set_duration(5).set_position('center')
        
        # 3. Composite the video together
        video = CompositeVideoClip([background, txt_clip])
        
        # 4. Write the final video file
        output_path = os.path.join(os.getcwd(), output_filename)
        video.write_videofile(
            output_path, 
            fps=24, 
            codec='libx264', 
            audio_codec='aac',
            logger=None # Keeps console clean during automated loops
        )
        
        print(f"✅ Video successfully created at: {output_path} [{text_message}]")
        
        # 5. Notify the live Render server to update counters for all platforms
        notify_server_all_platforms(text_message)
        
        return output_path

    except Exception as e:
        print(f"⚠️ Video generation warning/error (Check ImageMagick dependencies): {e}")
        return None

def notify_server_all_platforms(message):
    platforms = ["youtube", "tiktok", "instagram", "facebook"]
    
    for channel in platforms:
        payload = {"channel": channel, "ad_count": 1, "content_tag": message}
        try:
            response = session.post(SERVER_URL, json=payload, timeout=10)
            if response.status_code == 200:
                print(f"   ↳ Logged activity for {channel} on Render.")
            else:
                print(f"   ↳ Server response for {channel}: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"   ↳ Network error pinging server for {channel}: {e}")

if __name__ == "__main__":
    print("🚀 Starting automated hourly multi-platform video generator script...")
    
    # Run once immediately on startup
    generate_short_video()
    
    while True:
        print("⏳ Waiting for the next cycle (1 hour)...")
        time.sleep(3600)
        try:
            generate_short_video()
        except Exception as e:
            print(f"❌ Error during scheduled video generation loop: {e}")
