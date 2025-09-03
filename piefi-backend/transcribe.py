import moviepy.editor as mp
import openai
import os

def transcribe(myvid):
    # Extract audio from video
    video = mp.VideoFileClip(myvid)
    audio_path = "/tmp/audio.wav"  # Use /tmp for Vercel
    video.audio.write_audiofile(audio_path)
    video.close()  # Clean up video object
    
    # Use OpenAI Whisper API instead of local model
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    with open(audio_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )
    
    # Save transcription
    transcription_path = "/tmp/transcription.txt"  # Use /tmp for Vercel
    with open(transcription_path, "w") as f:
        f.write(transcript.text)
    
    # Clean up temp files
    os.remove(audio_path)
    
    return transcript.text