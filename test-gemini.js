const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const testGemini = async () => {
  const models = ['gemini-2.5-flash-lite'];
  
  console.log(`API Key: ${process.env.GEMINI_API_KEY ? 'Present' : 'Missing'}`);

  for (const modelName of models) {
    console.log(`\nTesting model: ${modelName}...`);
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent('Hello');
      const response = await result.response;
      console.log(`✅ ${modelName} SUCCESS! Response:`, response.text());
      return; // Stop after first success
    } catch (error) {
      console.error(`❌ ${modelName} Failed: ${error.message.split(']')[1] || error.message}`);
    }
  }
  console.log('\n❌ All models failed.');
};

testGemini();
