
export default async function handler(req, res) {
    // 1. Validations
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Get API Key from Environment
    const rawApiKey = process.env.DEEPSEEK_API_KEY;

    if (!rawApiKey) {
        return res.status(500).json({ error: 'Configuration Error: DEEPSEEK_API_KEY is missing.' });
    }

    // SANITIZATION: Remove whitespace AND quotes (common copy-paste error)
    const safeKey = rawApiKey.trim().replace(/^['"]|['"]$/g, '');

    console.log(`API Key check: ...${safeKey.slice(-4)} (Length: ${safeKey.length})`);

    // Detect the URL for the Referer header (Priority: Origin header -> Vercel URL -> Fallback)
    // OpenRouter requires a valid URL here.
    const siteUrl = req.headers.origin || req.headers.referer || `https://${process.env.VERCEL_URL}` || 'https://scriptcraft-ai.vercel.app';

    try {
        const { systemPrompt, userPrompt } = req.body;

        // 3. Call OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${safeKey}`,
                'HTTP-Referer': siteUrl, // Required by OpenRouter
                'X-Title': 'ScriptCraft AI' // Required by OpenRouter
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

        // 4. Handle Errors
        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter Error:", response.status, errorText);
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.error?.message || `Provider Error: ${response.status}`);
            } catch (e) {
                throw new Error(`Provider Error: ${response.status} - ${errorText}`);
            }
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error("Handler Error:", error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
