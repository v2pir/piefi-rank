from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import asyncio
import uuid
from typing import Dict, Any
from process import process
from rank import rank
from transcribe import transcribe
from write_to_json import summarize

app = FastAPI(title="Project Speed Leaderboard API")

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to your tasks JSON file
TASKS_FILE = "tasks.json"

def load_tasks() -> Dict[str, Any]:
    """Load tasks from JSON file"""
    try:
        with open(TASKS_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"tasks": []}
    except json.JSONDecodeError:
        return {"tasks": []}

# YOUR BACKGROUND WORKER FUNCTIONS GO HERE
# Just paste your actual functions here:

async def run_background_pipeline(video_path: str):
    """
    Run your background workers asynchronously
    This should call your transcribe(), summarize(), process(), rank() functions
    and save the results to tasks.json
    """
    # PLACEHOLDER - Replace this entire function with your actual pipeline
    # Example of what this should do:
    
    # 1. transcribed_text = transcribe(video_path)
    # 2. summary = summarize(transcribed_text)  
    # 3. processed_data = process(summary)
    # 4. rank()  # This should update tasks.json with new rankings

    transcribe(video_path)
    summarize(task_id=1)
    process()
    rank()
    
    print(f"Background processing started for: {video_path}")
    # Your actual processing logic goes here
    print("Background processing completed")

# API ENDPOINTS

@app.get("/")
async def root():
    return {"message": "Project Speed Leaderboard API"}

@app.get("/api/leaderboard")
async def get_leaderboard():
    """Get current leaderboard data from tasks.json"""
    try:
        data = load_tasks()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading leaderboard: {str(e)}")

@app.post("/api/upload-video")
async def upload_video(file: UploadFile = File(...)):
    """Upload video and trigger background processing"""
    try:
        # Validate file type
        if not file.content_type.startswith('video/'):
            raise HTTPException(status_code=400, detail="File must be a video")
        
        # Generate unique filename in /tmp for Vercel compatibility
        file_id = str(uuid.uuid4())
        video_path = f"/tmp/{file_id}_{file.filename}"
        
        # Save uploaded video to /tmp
        with open(video_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Start background processing (async - don't wait for it)
        asyncio.create_task(run_background_pipeline(video_path))
        
        # Return immediately - processing happens in background
        return {
            "message": "Video uploaded successfully. Processing in background...",
            "filename": file.filename,
            "status": "processing"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading video: {str(e)}")

@app.delete("/api/reset")
async def reset_leaderboard():
    """Reset the leaderboard (useful for testing)"""
    try:
        initial_data = {"tasks": []}
        with open(TASKS_FILE, 'w') as f:
            json.dump(initial_data, f, indent=2)
        return {"message": "Leaderboard reset successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resetting leaderboard: {str(e)}")