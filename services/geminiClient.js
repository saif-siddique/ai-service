require('dotenv').config();

// Using existing variable name as requested, though it contains OpenRouter key
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'google/gemma-3-12b-it:free'; // OpenRouter Model

const generateResponse = async (prompt, systemInstruction = '', retryCount = 0) => {
  const MAX_RETRIES = 3;
  const BACKOFF_BASE = 2000; // 2 seconds

  try {
    const messages = [];
    
    // For models like Gemma that don't support 'system' role, we prepend it to the prompt
    let finalPrompt = prompt;
    if (systemInstruction) {
      finalPrompt = `System Instruction:\n${systemInstruction}\n\nUser Query:\n${prompt}`;
    }
    
    // Add user prompt
    messages.push({ role: 'user', content: finalPrompt });

    console.log(`🚀 Sending request to OpenRouter (${MODEL})... (Attempt ${retryCount + 1})`);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.FRONTEND_URL, // Required by OpenRouter for free tier
        'X-Title': 'Hostel AI'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ OpenRouter API Error (${response.status}):`,  errorText);
      
      if (response.status === 429 || response.status === 402) {
        if (retryCount < MAX_RETRIES) {
           const waitTime = BACKOFF_BASE * (retryCount + 1); // 2s, 4s, 6s
           console.warn(`⏳ Rate Limit Hit. Waiting ${waitTime}ms before retry...`);
           await new Promise(resolve => setTimeout(resolve, waitTime));
           return generateResponse(prompt, systemInstruction, retryCount + 1);
        }
        return {
          success: false,
          response: 'I am receiving too many requests right now. Please wait a moment and try again.'
        };
      }
      
      throw new Error(`OpenRouter returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices && data.choices[0] && data.choices[0].message 
      ? data.choices[0].message.content 
      : '';
 
    console.log('🤖 OpenRouter Response received');

    return {
      success: true,
      response: text
    };

  } catch (error) {
    console.error('❌ AI Service Error:', error);
    return {
      success: false,
      response: 'I am currently unable to process your request. Please try again later.'
    };
  }
};

module.exports = { generateResponse }; 
