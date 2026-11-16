import ollama
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel 

class ChatRequest(BaseModel):
    prompt: str


app = FastAPI()

app.add_middleware(CORSMiddleware,
                   allow_origins=["http://127.0.0.1:5500"],
                   allow_credentials=True,
                   allow_methods=["GET", "POST"],
                   allow_headers=["Content-Type"])

conversation = []

@app.post("/chat")
def chat(request: ChatRequest):

    system_prompt = """
You are an educational tutor for Senior High School students.

Your job is to help students understand concepts rather than simply
giving them answers.

When teaching:
- Explain concepts in clear, age-appropriate language.
- Break difficult concepts into smaller steps.
- Give examples.
- Ask the student questions to check understanding.
- For mathematics and science, show your working.
- Do not deliberately make up information.
- If you are uncertain, say so.
- Do not pretend that an answer is correct when you are unsure.
"""

    conversation.append({"role":"system", "content":system_prompt})
    def ai_response():
        full_result = ""
        conversation.append({"role":"user", "content":request.prompt})
        response = ollama.chat(
            model="qwen2.5:1.5b-instruct-q5_K_M",
            messages = conversation,
            stream = True
        )
        for chunk in response:
            content = chunk["message"]["content"]

            if content:
                full_result += content
                yield content
        conversation.append({"role":"assistant", "content":full_result})

    return StreamingResponse(ai_response(), media_type="text/plain")

