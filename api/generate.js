
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { systemPrompt, userPrompt } = req.body;

    if (!process.env.DEEPSEEK_API_KEY) {
        return res.status(500).json({ error: 'Server Configuration Error: Missing API Key' });
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'HTTP-Referer': 'https://github.com/A20csda51/new-script-website', // Update if you have a real domain
                'X-Title': 'ScriptCraft AI'
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `OpenRouter API Error: ${response.status}`);
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
