import json
from client import client

def summarize(task_id=1):

    with open("tmp/transcription.txt", "r") as f:
        transcript = f.read()

    with open("tmp/tasks.json", "r") as f:
        tasks = json.load(f)

    tasks_str = json.dumps(tasks, indent=2)

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": "You are an expert summarizer. Extract accomplishments/progress from transcripts."
            },
            {
                "role": "user",
                "content": f"""
    Summarize the transcript below into exactly one sentence that describes what the speaker accomplished.
    Update the JSON under the 'description' field. Write it to the section with task id: {task_id}

    Transcript:
    {transcript}

    JSON:
    {tasks_str}
    """
            }
        ]
    )

    updated_json = json.loads(response.choices[0].message.content)

    text = json.dumps(updated_json, indent=2)

    with open("tmp/tasks.json", "w") as f:
        f.write(text)