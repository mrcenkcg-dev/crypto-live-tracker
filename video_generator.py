import os
import time
import requests
from moviepy.editor import TextClip, ColorClip, CompositeVideoClip

def generate_short_video(output_filename="output_short.mp4", text_message="Shoulder to Shoulder"):
    print("Generating vertical short video...")
    
    # 1. Create a dark background clip (Vertical 9:16 ratio for Shorts/Reels/TikTok: 1080x1920)
    background = ColorClip(size=(1080, 1920), color=(20, 20, 40), duration=5)
    
    # 2. Create text overlay
    txt_clip = TextClip(
        text_message, 
        fontsize=70, 
        color='white', 
        size=(1000, None), 
        method='caption'
    ).set_duration(5).set_position('center')
    
    # 3. Composite the video together
    video = CompositeVideoClip([background, txt_clip])
    
    # 4. Write the final video file
    output_path = os.path.join(os.getcwd(), output_filename)
    video.write_videofile(output_path, fps=24, codec='libx264', audio_codec='aac')
    
    print(f"Video successfully created at: {output_path}")
    
    # 5. Notify the live Render server to update counters for all platforms
    notify_server_all_platforms()
    
    return output_path

def notify_server_all_platforms():
    server_url = "https://mrcenk.onrender.com/api/log"
    
    # Your full network of connected platforms
    platforms = ["youtube", "tiktok", "instagram", "facebook"]
    
    for channel in platforms:
        payload = {"channel": channel, "ad_count": 1}
        try:
            response = requests.post(server_url, json=payload)
            if response.status_code == 200:
                print(f"Successfully logged activity for {channel}!")
            else:
                print(f"Failed to log for {channel}: {response.text}")
        except Exception as e:
            print(f"Error connecting to server for {channel}: {e}")

if __name__ == "__main__":
    print("Starting automated hourly multi-platform video generator script...")
    while True:
        try:
            generate_short_video()
        except Exception as e:
            print(f"Error during video generation cycle: {e}")
            
        print("Waiting for the next hour...")
        # Sleep for 1 hour (3600 seconds) before running again
        time.sleep(3600)
