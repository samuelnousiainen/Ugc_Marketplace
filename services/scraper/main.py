from fastapi import FastAPI
from services.scraper.db import save_summary, get_summary, update_summary
from services.scraper.scraper import extract_visible_text, chunk_text
from services.scraper.summarizer import summarize_chunks
from fastapi import HTTPException
import uvicorn


app = FastAPI()
    
@app.post("/summarize/{name}")
async def summarize_company(website: str, name: str):
    try:
        existing_summary = get_summary(name)
        
        if existing_summary:
            return {"summary": existing_summary}
        
        text = extract_visible_text(website)

        if not text:
            raise HTTPException(status_code=400, detail="No visible text found on the website")
        
        chunks = chunk_text(text)
        summary = summarize_chunks(chunks)
        save_summary(name, summary)
        return {"summary": summary}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during summarization: {e}")
    

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)