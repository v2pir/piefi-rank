import json
from client import client

def process():
    with open("/tmp/tasks.json", "r") as f:
        tasks = json.load(f)

    tasks_str = json.dumps(tasks, indent=2)

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        response_format={ "type": "json_object" },
        messages=[
            {
                "role": "system",
                "content": "You are a task evaluator. Fill in descriptions for tasks."
            },
            {
                "role": "user",
                "content": f"""Update the JSON below by filling in the "difficulty" fields.  
                Use a scale from 1 (trivial) to 100 (nearly impossible). 
                When assigning difficulty, take in consideration the time. It's significantly harder to do something big in a short amount of time compared to doing something small in a short amount of time. 
                Don't update anything else.

    JSON:
    {tasks_str}
    """
            }
        ]
    )

    updated_json = json.loads(response.choices[0].message.content)

    text = json.dumps(updated_json, indent=2)

    with open("/tmp/tasks.json", "w") as f:
        f.write(text)