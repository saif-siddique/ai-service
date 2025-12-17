const { OpenRouter } = require('@openrouter/sdk');
try {
  const client = new OpenRouter({ apiKey: 'test' });
  const chat = client.chat;
  console.log('Chat Proto:', Object.getPrototypeOf(chat));
  console.log('Chat Keys:', Object.keys(chat));
} catch (e) { console.error(e); }
