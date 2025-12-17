const { OpenRouter } = require('@openrouter/sdk');
require('dotenv').config();

const client = new OpenRouter({
  apiKey: process.env.GEMINI_API_KEY, 
});

async function test() {
  try {
    console.log('Testing OpenRouter...');
    const completion = await client.chat.completions.create({
      model: 'google/gemini-flash-1.5',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, say this is a test.' }
      ],
    });

    console.log('Response:', completion.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
