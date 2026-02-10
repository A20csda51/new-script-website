document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const generateBtn = document.getElementById('generateBtn');
    const outputArea = document.getElementById('outputArea');
    const loadingState = document.getElementById('loadingState');
    const copyBtn = document.getElementById('copyBtn');

    const videoTitle = document.getElementById('videoTitle');
    const videoTone = document.getElementById('videoTone');
    const targetAudience = document.getElementById('targetAudience');
    const keyPoints = document.getElementById('keyPoints');


    // --- Generation Logic ---
    // --- Generation Logic ---
    generateBtn.addEventListener('click', async () => {
        const title = videoTitle.value.trim();
        const tone = videoTone.value;
        const audience = targetAudience.value.trim();
        const points = keyPoints.value.trim();

        if (!title) {
            alert("Please enter a video title!");
            return;
        }

        // 1. UI State: Loading
        loadingState.classList.remove('hidden');
        generateBtn.disabled = true;
        generateBtn.classList.add('opacity-50', 'cursor-not-allowed');
        copyBtn.disabled = true;
        copyBtn.classList.add('opacity-50', 'cursor-not-allowed');

        // 2. Prompt Construction
        const systemPrompt = `You are a professional YouTube Script Writer. Your goal is to create highly engaging, retention-focused scripts.
        Format your response in clean Markdown. include:
        - **Hook** (0-15s): Grab attention immediately.
        - **Intro**: Briefly explain what the video is about.
        - **Body**: Broken down into clear sections/steps.
        - **Call to Action (CTA)**: Natural placement.
        - **Outro**: Concise ending.
        
        Tone: ${tone}
        Target Audience: ${audience || "General Audience"}
        `;

        const userPrompt = `Video Title: "${title}"
        Key Points to Include:
        ${points || "General overview of the topic."}
        
        Write a complete script for this video. Use visual cues in brackets like [Show B-Roll of...] or [Cut to Camera].`;

        try {
            // Call our own backend API
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    systemPrompt: systemPrompt,
                    userPrompt: userPrompt
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `Server Error: ${response.status}`);
            }

            const data = await response.json();
            const scriptContent = data.choices[0].message.content;

            // 3. Render Output
            outputArea.innerHTML = marked.parse(scriptContent);

            // Enable Copy
            copyBtn.disabled = false;
            copyBtn.classList.remove('opacity-50', 'cursor-not-allowed');

        } catch (error) {
            outputArea.innerHTML = `
                <div class="text-red-400 p-4 border border-red-500/20 rounded-lg bg-red-500/10 text-center">
                    <i class="fa-solid fa-triangle-exclamation text-2xl mb-2"></i>
                    <p class="font-bold">Generation Failed</p>
                    <p class="text-sm opacity-80">${error.message}</p>
                </div>
            `;
        } finally {
            // Restore UI
            loadingState.classList.add('hidden');
            generateBtn.disabled = false;
            generateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });

    // --- Copy Functionality ---
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputArea.innerText; // Get raw text
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `<i class="fa-solid fa-check text-green-400"></i> Copied!`;
            copyBtn.classList.add('text-green-400');

            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.remove('text-green-400');
            }, 2000);
        });
    });

});
