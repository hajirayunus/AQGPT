# AQGPT

AQGPT is an original, responsive AI chat application with a clean conversational interface, local chat history, and a server-side OpenAI API connection.

## Features
- Responsive chat interface for desktop and mobile
- Multiple conversations saved in the browser
- New chat and delete conversation controls
- Dark and light themes
- Starter prompts, loading states, and friendly error messages
- API key kept on the server, never placed in frontend code

## Requirements
- Node.js 18 or newer
- An OpenAI API key

## Run locally
1. Clone this repository and enter the project folder.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and add your key:
   ```env
   OPENAI_API_KEY=your_actual_key
   OPENAI_MODEL=gpt-4o-mini
   ```
4. Start the API server in one terminal: `npm start`
5. Start the frontend in another terminal: `npm run dev`
6. Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
Run `npm run build` to create the static frontend in `dist/`. Deploy the frontend and Express API together, or configure your host to route `/api` requests to the Node server. Set `OPENAI_API_KEY` as a server-side environment variable in your hosting provider.

## Security
- Do not commit `.env` or share your API key.
- Never add the key to Vite variables such as `VITE_OPENAI_API_KEY`; frontend variables are exposed to browsers.
- API usage may incur charges under the account associated with your key.

AQGPT is an independent project and is not an OpenAI or ChatGPT product.