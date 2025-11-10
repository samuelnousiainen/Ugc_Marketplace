from transformers import pipeline


summarizer = pipeline("summarization", model="facebook/bart-large-cnn", tokenizer="facebook/bart-large-cnn")


def summarize_chunks(chunks, max_length=150, min_length=40):
    try:
        summaries = []
        for chunk in chunks:
            summary = summarizer(chunk, max_length=max_length, min_length=min_length, do_sample=False)[0]['summary_text']
            summaries.append(summary)
    except Exception as e:
        print(f"Error during summarization: {e}")
    
    combined = " ".join(summaries)


    if len(combined.split()) > 300:
        final = summarizer(combined, max_length=max_length, min_length=min_length, do_sample=False)[0]['summary_text']
        return final
    else:
        return combined
