import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are an expert code reviewer. Analyze the provided code and return a JSON response with exactly these keys:
- bugs: list of bug descriptions
- security: list of security vulnerabilities
- performance: list of performance improvement suggestions
- refactored_code: a cleaner, improved version of the code

Return ONLY valid JSON. No markdown, no explanation outside the JSON.
"""

def review_code(code: str) -> dict:
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Review this code:\n\n{code}"}
            ],
            response_format={"type": "json_object"}
        )
        import json
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        return {
            "bugs": [],
            "security": [],
            "performance": [],
            "refactored_code": "",
            "error": f"Review failed: {str(e)}"
        }