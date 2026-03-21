from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from reviewer import review_code
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://code-review-ai-f1se.onrender.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)

history = []

@app.post("/review")
async def review(
    code: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    if file:
        contents = await file.read()
        code = contents.decode("utf-8")
    
    if not code:
        return {"error": "No code provided"}
    
    result = review_code(code)
    
    history.append({
        "timestamp": datetime.now().isoformat(),
        "code_snippet": code[:100],
        "result": result
    })
    
    return result

@app.get("/history")
async def get_history():
    return history