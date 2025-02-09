# Career Path Recommendation System

An AI-powered career guidance platform that analyzes students' academic records and certifications to provide personalized career recommendations.

![Career Recommendations](assets/career-recommendations.png)
![Document Upload](assets/document-upload.png)

## Overview

The Career Path Recommendation System helps students:
- Upload and analyze academic records (grade cards)
- Process certification information
- Get AI-powered career recommendations
- Access relevant learning resources
- View personalized skill development paths

## Key Features

### Core Features
- 🔐 Secure user authentication
- 📄 Document upload (CSV/JSON support)
- 🤖 AI-powered analysis using Google Gemini
- 🎯 Personalized career recommendations
- 📚 Learning resource suggestions
- 📊 Academic strength analysis

### Technical Features
- Dark theme UI
- Responsive design
- File format validation
- Real-time processing
- YouTube tutorial integration
- Error handling & validation

## Tech Stack

### Backend
- Django 4.2+
- Django REST Framework
- PostgreSQL
- Google Gemini AI
- YouTube Data API
- Python 3.8+

### Frontend
- React 18+
- Tailwind CSS
- Framer Motion
- Axios
- React Router v6
- Context API

## Project Structure
career-path-recommendation/
├── backend/ # Django backend
├── frontend/ # React frontend
├── sample_data/ # Test data samples
├── assets/ # Screenshots & images
├── requirements.txt # Python dependencies
└── README.md # Project documentation


## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL
- Google Gemini API key
- YouTube Data API key

### Backend Setup

bash
Create virtual environment
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
Install dependencies
pip install -r requirements.txt
Setup environment variables
cp .env.example .env
Edit .env with your configurations
Run migrations
python manage.py migrate
Start server
python manage.py runserver

### Frontend Setup

bash
cd frontend
Install dependencies
npm install
Start development server
npm run dev

## Environment Variables

### Backend (.env)
Database
DB_NAME=career_recommendation
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
API Keys
YOUTUBE_API_KEY=your_youtube_api_key
GEMINI_API_KEY=your_gemini_api_key
Django
DEBUG=True
SECRET_KEY=your_secret_key
ALLOWED_HOSTS=localhost,127.0.0.1

### Frontend (.env)
env
VITE_API_URL=http://localhost:8000

Let me know if you want me to continue with the other parts covering:
Each section will be detailed and well-structured!
