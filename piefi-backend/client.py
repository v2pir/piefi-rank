from openai import OpenAI
import whisper
from dotenv import load_dotenv
load_dotenv()

client = OpenAI()

model = whisper.load_model("small")