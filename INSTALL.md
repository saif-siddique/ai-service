# AI Service Installation & Setup

## 1. Navigate to directory
```bash
cd ai-service
```

## 2. Install Dependencies
```bash
npm install
```

## 3. Configure Environment
Create a `.env` file in `gravity/ai-service/.env` with:
```env
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
```

## 4. Run the Service
```bash
# Development Mode (Auto-restart)
npm run dev

# Production
npm start
```

## 5. API Endpoints
- **Admin**: `POST http://localhost:5001/admin/query` (Requires Bearer Token)
- **Student**: `POST http://localhost:5001/student/query` (Requires Bearer Token)
- **Visitor**: `POST http://localhost:5001/visitor/query` (Public)

## 6. Testing
You can use Postman or curl to test the endpoints.
```bash
# Test Visitor Endpoint
curl -X POST http://localhost:5001/visitor/query \
     -H "Content-Type: application/json" \
     -d '{"prompt": "What are the room prices?"}'
```
