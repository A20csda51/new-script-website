
export default async function handler(req, res) {
    // 1. Validations
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Get API Key from Environment
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
        console.error("Critical: DEEPSEEK_API_KEY is missing from environment variables.");
        return res.status(500).json({ error: 'Server Configuration Error: Missing API Key' });
    }

    // Safe logging to help user debug (only shows last 4 chars)
    const safeKey = apiKey.trim(); // Remove any potential whitespace
    console.log(`Using API Key ending in ...${safeKey.slice(-4)}`);

    try {
        const { systemPrompt, userPrompt } = req.body;

        // 3. Call OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${safeKey}`, // Use trimmed key
                'HTTP-Referer': `https://${process.env.VERCEL_URL || 'scriptcraft-ai.vercel.app'}`, // Use Vercel URL or fallback
                'X-Title': 'ScriptCraft AI'
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7
            })
        });

        // 4. Handle Errors from OpenRouter
        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API Error:", response.status, errorText);
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.error?.message || `OpenRouter Error: ${response.status}`);
            } catch (e) {
                throw new Error(`OpenRouter Error: ${response.status} - ${errorText}`);
            }
        }

        // 5. Return Success
        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error("Backend Handler Error:", error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
