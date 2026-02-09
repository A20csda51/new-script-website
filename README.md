# ScriptCraft AI - YouTube Script Builder

A premium, dark-mode web application that uses the DeepSeek API to generate high-quality YouTube scripts.

## How to Use

1.  **Open the Application**:
    - Navigate to the folder: `C:\Users\Siva shankar\.gemini\antigravity\scratch\yt-script-builder`
    - Double-click on `index.html` to open it in your web browser (Chrome, Edge, Firefox, etc.).

2.  **Verify API Key**:
    - Click the **Gear Icon** (Settings) in the top-right corner.
    - Your DeepSeek API Key should already be pre-filled: `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`.
    - If not, paste your key there and click **Save Changes**.

3.  **Generate a Script**:
    - **Video Title**: Enter the topic of your video (e.g., "Top 10 AI Tools in 2026").
    - **Tone**: Select a tone (e.g., "High Energy", "Educational").
    - **Target Audience**: (Optional) Specify who this video is for.
    - **Key Points**: (Optional) accurate list of points you want covered.
    - Click **Generate Script**.

4.  **Copy & Use**:
    - Once generated, click the **Copy** button to copy the script to your clipboard.

## Troubleshooting

### Generation Failed?
- **Check Internet Connection**: Ensure you are online.
- **API Key**: Verify the key in Settings is correct and has credits.
- **CORS Error**: If you see a network error in the console (F12 > Console) related to CORS:
    - This means the browser security is blocking the direct request to DeepSeek.
    - **Solution**: Install a browser extension like "Allow CORS: Access-Control-Allow-Origin" (for testing purposes only).
    - **Alternate Solution**: Run a local server (requires Node.js).
