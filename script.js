document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const generateBtn = document.getElementById('generateBtn');
    const outputArea = document.getElementById('outputArea');
    const loadingState = document.getElementById('loadingState');
    const copyBtn = document.getElementById('copyBtn');

    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettings = document.getElementById('saveSettings');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const toggleApiKey = document.getElementById('toggleApiKey');

    const videoTitle = document.getElementById('videoTitle');
    const videoTone = document.getElementById('videoTone');
    const targetAudience = document.getElementById('targetAudience');
    const keyPoints = document.getElementById('keyPoints');

    // Default Key (User Provided) - In a real app, strict handling. For this demo, accessible.
    let DEEPSEEK_API_KEY = localStorage.getItem('deepseek_api_key') || "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";

    // Initialize Input
    apiKeyInput.value = DEEPSEEK_API_KEY;

    // --- Modal Logic ---
    function openModal() {
        settingsModal.classList.remove('hidden');
        // Small timeout to allow display:flex to apply before opacity transition
        setTimeout(() => {
            settingsModal.classList.add('modal-show');
        }, 10);
    }

    function closeModal() {
        settingsModal.classList.remove('modal-show');
        setTimeout(() => {
            settingsModal.classList.add('hidden');
        }, 300); // Match transition duration
    }

    settingsBtn.addEventListener('click', openModal);
    closeSettings.addEventListener('click', closeModal);

    saveSettings.addEventListener('click', () => {
        const newKey = apiKeyInput.value.trim();
        if (newKey) {
            DEEPSEEK_API_KEY = newKey;
            localStorage.setItem('deepseek_api_key', newKey);
            closeModal();
            // Optional: Show toast
        }
    });

    // Close modal on outside click
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeModal();
    });

    // Toggle Password Visibility
    toggleApiKey.addEventListener('click', () => {
        const type = apiKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
        apiKeyInput.setAttribute('type', type);
        toggleApiKey.innerHTML = type === 'password' ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>';
    });


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

        // 2. prompt Construction
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
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                    'HTTP-Referer': 'https://github.com/A20csda51/new-script-website', // Use a valid URL
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
                const errData = await response.json();
                console.error("API Error:", errData);
                throw new Error(errData.error?.message || `API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errData)}`);
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
                    <p class="text-xs mt-2 text-gray-400">Check your API Key in Settings.</p>
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
