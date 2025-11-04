import requests
from bs4 import BeautifulSoup
from api_client import get_company_website
import re
from collections import Counter

def extract_visible_text(url):
    # Get page content
    html = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}).text
    soup = BeautifulSoup(html, "html.parser")

    # Remove irrelevant sections
    for tag in soup(["script", "style", "noscript", "header", "footer", "nav", "form", "svg"]):
        tag.decompose()

    # Get text from body only
    body = soup.body
    if not body:
        body = soup  # fallback if body tag missing

    # Collect text nodes
    texts = body.find_all(text=True)

    # Filter out empty / decorative strings
    visible_texts = []
    for t in texts:
        stripped = t.strip()
        if not stripped:
            continue
        # Ignore typical UI junk
        if re.match(r"^(Accept|Subscribe|Sign up|Log in|Cookie|Privacy|Menu|©)", stripped, re.I):
            continue
        # Skip single punctuation marks or icons
        if len(stripped) < 3 and not stripped.isalpha():
            continue
        visible_texts.append(stripped)

    # Combine to readable text
    text = " ".join(visible_texts)
    # Normalize spaces
    text = re.sub(r"\s+", " ", text)

    return text


def chunk_text(text, max_len=800):
    sentences = re.split(r'(?<=[.!?]) +', text)
    chunks, current = [], ""
    for s in sentences:
        if len(current) + len(s) < max_len:
            current += s + " "
        else:
            chunks.append(current.strip())
            current = s + " "
    if current:
        chunks.append(current.strip())
    return chunks


