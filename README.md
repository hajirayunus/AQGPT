# AQGPT

AQGPT is an original, responsive AI chat application with a clean conversational interface, local chat history, dark/light themes, and optional Google web search with linked sources.

## Features
- Ask general questions and receive AI-generated answers
- Optional Google web search through SerpAPI, with source links shown below answers
- Responsive chat interface for desktop and mobile
- Multiple conversations saved in the browser
- New chat and delete conversation controls
- Dark and light themes
- Starter prompts, loading states, and friendly error messages
- API keys kept on the server, never placed in frontend code

## Requirements
- Node.js 18 or newer
- An OpenAI API key
- A SerpAPI key for Google web search (optional but recommended)

## Run locally
1. Clone this repository and enter the project folder.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your keys:
   ```env
   OPENAI_API_KEY=your_actual_openai_key
   OPENAI_MODEL=gpt-4o-mini
   SERPAPI_KEY=your_actual_serpapi_key
   PORT=3001
   ```
4. Start the API server in one terminal: `npm start`
5. Start the frontend in another terminal: `npm run dev`
6. Open the local URL printed by Vite (usually http://localhost:5173).

If `SERPAPI_KEY` is not configured, AQGPT still answers using the AI model's general knowledge, but it will not fetch live web results or show web sources. When configured, AQGPT searches Google results for the latest user question and supplies the results to the AI model as reference material.

## Production build
Run `npm run build` to create the static frontend in `dist/`. Deploy the frontend and Express API together, or configure your host to route `/api` requests to the Node server. Set `OPENAI_API_KEY` and (if using web search) `SERPAPI_KEY` as server-side environment variables in your hosting provider.

## Security and search notes
- Do not commit `.env` or share your API keys.
- Never add keys to Vite variables such as `VITE_OPENAI_API_KEY`; frontend variables are exposed to browsers.
- OpenAI and SerpAPI usage may incur charges under their respective account plans.
- Google's Custom Search JSON API is closed to new customers; this project uses SerpAPI to retrieve Google search results instead. See [Google's API notice](https://developers.google.com/custom-search/v1/overview).
- AQGPT is an independent project and is not an OpenAI or ChatGPT product.
