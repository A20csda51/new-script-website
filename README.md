# ScriptCraft AI - YouTube Script Builder

A premium, dark-mode web application that uses the DeepSeek API to generate high-quality YouTube scripts.

## 🚀 Deployment

This project is designed to be deployed on **Vercel** (or any platform supporting Serverless Functions).

1.  **Push to GitHub**: Upload your code to a GitHub repository.
2.  **Import to Vercel**: Connect your GitHub repo to Vercel.
3.  **Environment Variables**: In Vercel Project Settings, add:
    *   `DEEPSEEK_API_KEY`: Your actual API key.
4.  **Deploy**: Vercel will build and deploy your site.

## 🛠️ Local Development

To run this locally (requires Node.js & Vercel CLI):

1.  Install Vercel CLI: `npm i -g vercel`
2.  Login: `vercel login`
3.  Run: `vercel dev`
4.  Open `http://localhost:3000`

The app will use the backend API at `/api/generate` instead of exposing keys in the frontend.
