# AI Resume Analyzer

A full-stack web application that helps job seekers optimize their resumes using ATS (Applicant Tracking System) analysis and practice mock interviews with AI-powered feedback.

## Features

### 🎯 ATS Resume Analysis
- Upload resumes in PDF format
- Analyze resumes against job descriptions
- Get ATS compatibility scores (0-100%)
- Receive keyword matching analysis
- Get actionable improvement suggestions

### 💼 Mock Interview Practice
- Role-specific interview questions
- Multiple job categories (Software Engineer, Data Scientist, Product Manager, etc.)
- Real-time answer submission
- Comprehensive feedback with scores
- Track interview history

### 📊 Dashboard & Analytics
- View all uploaded resumes
- Track average ATS scores
- Monitor interview performance
- Quick access to recent activities

### 🔐 User Authentication
- Secure JWT-based authentication
- User registration and login
- Protected routes
- Persistent sessions

## Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **PDF-Parse** - PDF text extraction

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-resume-analyzer
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
```

4. Start MongoDB (if using local installation):
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

5. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Client directory:
```bash
cd Client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Client directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### AI Service Setup (Python)

1. Navigate to the ai-service directory:
```bash
cd ai-service
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure your API keys in `ai-service/.env`.

4. Start the AI service:
```bash
python ai-service.py
```

The AI service will run on `http://localhost:5001`.

## Usage

### 1. Register/Login
- Navigate to `http://localhost:5173`
- Click "Sign up" to create a new account
- Or login with existing credentials

### 2. Upload Resume
- From the dashboard, click "Upload Resume"
- Select a PDF file of your resume
- The resume will be uploaded and processed

### 3. Analyze Resume
- Click on a resume from your dashboard
- Paste a job description in the text area
- Click "Analyze Resume"
- View your ATS score, keyword matches, and suggestions

### 4. Mock Interview
- Navigate to "Mock Interview" from the sidebar
- Select a job role
- Click "Start Interview"
- Answer each question
- Complete the interview to receive feedback

### 5. View History
- Navigate to "History" from the sidebar
- View all your resumes and interviews
- Delete items as needed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Resumes
- `POST /api/resumes/upload` - Upload resume (protected)
- `GET /api/resumes` - Get all user resumes (protected)
- `GET /api/resumes/:id` - Get single resume (protected)
- `PUT /api/resumes/:id/analyze` - Analyze resume (protected)
- `DELETE /api/resumes/:id` - Delete resume (protected)

### Interviews
- `POST /api/interviews` - Create interview session (protected)
- `GET /api/interviews` - Get all user interviews (protected)
- `GET /api/interviews/:id` - Get single interview (protected)
- `PUT /api/interviews/:id/answer` - Submit answer (protected)
- `POST /api/interviews/:id/complete` - Complete interview (protected)
- `DELETE /api/interviews/:id` - Delete interview (protected)

## Project Structure

```
AI_Resume/
├── Client/                 # Frontend React application
│   ├── src/
│   │   ├── Component/     # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── Routes/        # Route configuration
│   │   ├── services/      # API service layer
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                # Backend Node.js application
    ├── models/            # Mongoose models
    ├── routes/            # Express routes
    ├── middleware/        # Custom middleware
    ├── utils/             # Utility functions
    ├── server.js          # Entry point
    └── package.json
```

## Features in Detail

### ATS Scoring Algorithm
The ATS scorer evaluates resumes based on:
- **Keyword Matching (40%)** - Matches keywords from job description
- **Resume Structure (30%)** - Checks for essential sections
- **Content Quality (30%)** - Evaluates action verbs and quantifiable achievements

### Interview Feedback System
The interview feedback analyzes:
- Answer length and detail
- Use of specific examples (STAR method)
- Action verbs and achievements
- Quantifiable results
- Overall structure

## Future Enhancements

- [ ] Integration with OpenAI/Gemini for advanced AI analysis
- [ ] Resume template builder
- [ ] Cover letter generation
- [ ] LinkedIn profile optimization
- [ ] Job matching recommendations
- [ ] Email notifications
- [ ] Export reports as PDF
- [ ] Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for job seekers everywhere
