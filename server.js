/**
 * 🚀 GRAVITY HOSTEL AI MICROSERVICE (Production Ready)
 * Single File Implementation
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// --- 1. CONFIGURATION & ENV ---
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// --- 2. API KEY MANAGER (ROTATION LOGIC) ---
// Handles multiple keys for redundancy. If one fails, it switches to the next.
class KeyManager {
    constructor(keys) {
        this.keys = keys.filter(k => k && k.length > 0);
        this.currentIndex = 0;
        if (this.keys.length === 0) console.warn("⚠️ No Valid AI API Keys provided!");
    }

    getCurrentKey() {
        return this.keys[this.currentIndex];
    }

    rotateKey() {
        const oldIndex = this.currentIndex;
        this.currentIndex = (this.currentIndex + 1) % this.keys.length;
        console.log(`🔄 Switching API Key: Key ${oldIndex + 1} -> Key ${this.currentIndex + 1}`);
    }
}

// Load keys from .env (comma separated or separate variables)
const rawKeys = [process.env.GEMINI_API_KEY_1, process.env.GEMINI_API_KEY_2];
const keyManager = new KeyManager(rawKeys);
const AI_MODEL = 'google/gemini-2.0-flash-lite-preview-02-05:free'; // High performance, low cost model

// --- 3. MIDDLEWARE ---
app.use(cors({
    // Allow both your specific frontend and localhost for testing
    origin: function (origin, callback) {
        const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000', 'https://gravityhostel.vercel.app'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Auth Middleware
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error('❌ Auth Error:', error.message);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

// --- 4. AI SERVICE (CORE LOGIC) ---
const generateAIResponse = async (prompt, systemInstruction, retryCount = 0) => {
    const MAX_RETRIES = 3;
    const currentKey = keyManager.getCurrentKey();

    try {
        const messages = [];
        // Combine system instruction into the prompt structure for models that prefer it this way
        // or use OpenRouter's system role if supported.
        messages.push({ role: 'system', content: systemInstruction });
        messages.push({ role: 'user', content: prompt });

        console.log(`🤖 AI Request (Attempt ${retryCount + 1}) using Key index ${keyManager.currentIndex}`);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${currentKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.FRONTEND_URL || 'https://gravityhostel.com',
                'X-Title': 'Gravity Hostel AI'
            },
            body: JSON.stringify({
                model: AI_MODEL,
                messages: messages,
                temperature: 0.7, // Slightly creative but focused
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            
            // Check for Rate Limit (429) or Payment Required (402)
            if (response.status === 429 || response.status === 402) {
                console.warn(`⚠️ Key Limit Hit (${response.status}). Rotating key...`);
                keyManager.rotateKey();
                
                if (retryCount < MAX_RETRIES) {
                    return generateAIResponse(prompt, systemInstruction, retryCount + 1);
                }
            }
            throw new Error(`OpenRouter Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || "I couldn't process that.";
        return { success: true, response: text };

    } catch (error) {
        console.error('❌ AI Service Exception:', error.message);
        
        // Final fallback if retries exhausted
        if (retryCount < MAX_RETRIES) {
            // Wait 1 second before hard retry
            await new Promise(r => setTimeout(r, 1000));
            return generateAIResponse(prompt, systemInstruction, retryCount + 1);
        }

        return { 
            success: false, 
            response: "I'm experiencing high traffic right now. Please try again in a moment." 
        };
    }
};

// --- 5. SYSTEM PROMPTS ---

const getStudentSystemPrompt = (student) => `
You are an intelligent assistant for ${student.name} at Gravity Hostel.
Your goal is to be helpful, strictly accurate, and concise.

**STUDENT DATA (Context):**
- Room: ${student.room || 'Not Assigned'}
- Attendance: ${JSON.stringify(student.attendance || [])}
- Fees Status: ${JSON.stringify(student.fees || [])}
- Notifications: ${JSON.stringify(student.notifications || [])}

**STRICT GUIDELINES:**
1. **Privacy:** NEVER answer questions about other students. If asked, say "I can only access your personal records."
2. **Accuracy:** Calculate answers from the provided data. Do not guess. If data is missing, say "I don't have that info."
3. **Tone:** Professional yet friendly.
4. **Current Time:** ${new Date().toLocaleString()} (Use this for "today/yesterday" queries).
`;

const VISITOR_SYSTEM_PROMPT = `
You are the AI Receptionist for "Gravity Hostel". 
Your goal is to convert visitors into students by being helpful and persuasive.

**HOSTEL INFO:**
- **Location:** 123 Bosan Road, Multan.
- **Pricing:** - 3-Seater: 8k/mo
  - 2-Seater: 12k/mo
  - 1-Seater: 20k/mo
- **Amenities:** Fiber WiFi, Gym, Library, 3 Meals/Day, 24/7 Power.
- **Rules:** Curfew 10 PM. No overnight guests.

**GUIDELINES:**
1. **Scope:** Answer only about hostel facilities, pricing, and rules.
2. **Privacy:** NEVER discuss specific students or staff.
3. **Call to Action:** Encourage them to visit the office or apply at gravityhostel.com.
4. **Tone:** Welcoming and informative. Keep responses short.
`;

// --- 6. CONTROLLERS ---

// A. Student Query Handler
const handleStudentQuery = async (req, res) => {
    try {
        const { prompt, studentData } = req.body;
        
        if (!prompt) return res.status(400).json({ success: false, message: 'Prompt required' });

        // Use injected context or fallback
        const context = studentData || { name: 'Student', attendance: [], fees: [] };
        const systemPrompt = getStudentSystemPrompt(context);

        const result = await generateAIResponse(prompt, systemPrompt);
        
        res.json({ success: result.success, data: result.response });
    } catch (err) {
        console.error("Student Handler Error:", err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// B. Visitor Query Handler
const handleVisitorQuery = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ success: false, message: 'Prompt required' });

        const result = await generateAIResponse(prompt, VISITOR_SYSTEM_PROMPT);
        res.json({ success: result.success, data: result.response });
    } catch (err) {
        console.error("Visitor Handler Error:", err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- 7. ROUTES SETUP ---
const apiRouter = express.Router();

// Student Route (Protected)
apiRouter.post('/student/query', protect, handleStudentQuery);

// Visitor Route (Public)
apiRouter.post('/visitor/query', handleVisitorQuery);

// Mount Router
app.use('/api', apiRouter);

// Health Check
app.get('/', (req, res) => res.send('🚀 Gravity Hostel AI Service is Active'));

// --- 8. SERVER STARTUP ---
const startServer = async () => {
    try {
        // Only connect to DB if you need to fetch data here. 
        // If your main backend handles DB and passes data via 'studentData' in body, 
        // you technically don't need Mongo here. But keeping it for future proofing.
        if (process.env.MONGO_URI) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('📦 MongoDB Connected');
        }

        app.listen(PORT, () => {
            console.log(`🚀 AI Server running on port ${PORT}`);
            console.log(`🔑 Loaded ${keyManager.keys.length} API Keys`);
        });
    } catch (err) {
        console.error('❌ Startup Error:', err);
        process.exit(1);
    }
};

startServer();