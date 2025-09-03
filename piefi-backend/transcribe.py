import moviepy.editor as mp
from client import model

def transcribe(myvid):

    video = mp.VideoFileClip(myvid)
    video.audio.write_audiofile("audio.wav")

    result = model.transcribe("audio.wav")

    with open("transcription.txt", "w") as f:
        f.write(result["text"])

    f.close()