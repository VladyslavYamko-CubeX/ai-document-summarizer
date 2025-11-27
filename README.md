# Document Summarizer (Next.js 15)

A client-first tech demo that summarizes uploaded text or markdown files using your own OpenAI API key. Keys are never persisted: they live only in component state and are forwarded to the API route solely for the current request.

## Features
- Upload `.txt` or `.md` files (simple `.pdf` best-effort text extraction).
- Preview the first portion of your document before summarizing.
- Provide your own OpenAI API key directly in the UI (no env vars or server storage).
- Choose summary length (Short/Medium/Long) and tone (Neutral/Friendly/Formal).
- Server-side summarization via a Next.js API route using the `openai` SDK.

## Getting Started

> Package installation may require internet access to reach the npm registry.

```bash
npm install
npm run dev
```

Then open http://localhost:3000 and provide your OpenAI API key when prompted.

## How it works
- The API key is collected in the UI and stored only in React state.
- Summarization is handled by `/api/summarize`, which instantiates `OpenAI` with the provided key and never reads any server-side secrets.
- Inputs longer than 50k characters are truncated with a note in the returned summary.
