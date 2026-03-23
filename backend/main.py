from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from typing import Optional
from reviewer import review_code
from datetime import datetime

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://code-review-ai-f1se.onrender.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)

history = []

@app.post("/review")
@limiter.limit("10/minute")
async def review(
    request: Request,
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

@app.post("/history")
async def post_history():
    return history