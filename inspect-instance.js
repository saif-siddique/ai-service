const { OpenRouter } = require('@openrouter/sdk');
try {
  const client = new OpenRouter({ apiKey: 'test' });
  console.log('Client Keys:', Object.keys(client));
  console.log('Client Proto:', Object.getPrototypeOf(client));
  if (client.chat) console.log('Client.chat:', client.chat);
} catch (e) {
  console.error(e);
}
