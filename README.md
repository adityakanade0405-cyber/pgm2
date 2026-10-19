# AI Language Translator & Text Simplifier

A beginner-friendly Node.js + Express project for a Gen AI practical. It accepts an academic paragraph and shows translation, beginner-friendly English, a technical glossary, and a comparison of meaning, accuracy, and completeness.

## Requirements
- Node.js 18 or newer
- VS Code
- Internet connection for Gemini AI features

## Run in VS Code
1. Extract this ZIP file.
2. Open the extracted `AI_Language_Translator_Simplifier` folder in VS Code.
3. In VS Code, choose **Terminal → New Terminal**.
4. Run `npm install`.
5. Optional but recommended for real AI output:
   - Copy `.env.example` to a new file named `.env`.
   - Get a Gemini API key from https://aistudio.google.com/app/apikey
   - Paste the key after `GEMINI_API_KEY=` in `.env`. Do not share this key or upload `.env`.
6. Run `npm start`.
7. Open http://localhost:3000 in your browser.
8. Click **Load sample**, select a target language, then click **Process text**.
9. Check Translation, Simplified English, Technical glossary, and Output comparison.

## Important: AI mode and demo mode
- With a valid `GEMINI_API_KEY`, the server requests live AI output from Gemini.
- Without a key, the app runs in **Demo mode**. Simplification uses a few word substitutions; the translation panel explicitly tells you that a real translation requires an API key. The glossary and comparison are generic examples in demo mode.
- Do not describe demo mode as live AI. Review translations and technical explanations for accuracy.

## Project structure
- `server.js` — Express server and Gemini API integration
- `public/index.html` — webpage structure
- `public/style.css` — responsive styling
- `public/script.js` — button behavior and result rendering
- `.env.example` — optional API key configuration
