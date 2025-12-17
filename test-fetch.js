require('dotenv').config();

// Use the existing GEMINI_API_KEY which contains the OpenRouter key
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'google/gemini-2.0-flash-exp:free';

async function testFetch() {
  console.log('Testing OpenRouter via Fetch...');
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5001', // Optional
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'user', content: 'Say hello.' }
        ]
      })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Status ${response.status}: ${text}`);
    }

    const data = await response.json();
    console.log('Response:', data.choices[0].message.content);

  } catch (error) {
    console.error('Fetch Error:', error);
  }
}

testFetch();
