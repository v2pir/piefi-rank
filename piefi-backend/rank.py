import json
from client import client

def rank():

    with open("/tmp/tasks.json", "r") as f:
        data = json.load(f)

    tasks_str = json.dumps(data, indent=2)

    pace_dict = {}

    # Loop through tasks and grab what you need
    for task in data["tasks"]:
        task_id = task["id"]
        time_taken = task["time_taken"]
        difficulty = task["difficulty"]

        pace = difficulty/time_taken

        pace_dict[task_id] = pace

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        response_format={ "type": "json_object" },
        messages=[
            {
                "role": "system",
                "content": "You are a ranker. Fill in the rank section for each task"
            },
            {
                "role": "user",
                "content": f"""Update the JSON below by filling in the "rank" fields. 
                You are going to look at the paces of each ID and give them a rank out of all the paces that you see. 
                The ID with the fastest/highest pace is ranked #1 and the ID with the lowest/slowest pace is ranked last, whatever number that might be.
                For example, if ID 2's pace is 47.5 and ID 1's pace is 30.0, then ID 2 is ranked 1 and ID 1 is ranked 2, assuming there are only 2 tasks in this scenario.
                
                The IDs and respective paces are here: {pace_dict}
                The key:value pair is id:pace

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