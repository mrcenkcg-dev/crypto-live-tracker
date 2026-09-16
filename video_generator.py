import os
from moviepy.editor import TextClip, ColorClip, CompositeVideoClip

def generate_short_video(output_filename="output_short.mp4", text_message="Shoulder to Shoulder"):
    print("Generating vertical short video...")
    
    # 1. Create a dark background clip (Vertical 9:16 ratio for Shorts/TikTok: 1080x1920)
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
    return output_path

if __name__ == "__main__":
    generate_short_video()
