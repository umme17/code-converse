# InterviewHub 🎤

A modern online interview platform that enables organizations to conduct technical interviews remotely through video conferencing, collaborative coding, screen sharing, and interview recordings.

Built to provide a seamless experience for both interviewers and candidates while simplifying the interview management process.

## Features

### 🎥 Real-Time Video Interviews

* High-quality video and audio calls
* One-on-one interview sessions
* Low-latency communication

### 💻 Collaborative Code Editor

* Real-time coding environment
* Ideal for technical interviews
* Live code collaboration between interviewer and candidate

### 🖥️ Screen Sharing

* Share applications, browser tabs, or entire screens
* Useful for system design discussions and project demonstrations

### 🎬 Interview Recording

* Record interview sessions
* Review previous interviews anytime
* Maintain interview history for evaluation purposes

### 📅 Interview Scheduling

* Schedule upcoming interviews
* Manage interview sessions efficiently
* Track upcoming and completed interviews

### 🔐 Authentication & Authorization

* Secure user authentication with Clerk
* Role-based access control
* Protected routes and resources

### ⚡ Modern Next.js Architecture

* Server Components
* Client Components
* Server Actions
* Dynamic & Static Routing
* Optimized application performance

## Tech Stack

### Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* shadcn/ui

### Authentication

* Clerk

### Real-Time Communication

* Stream Video SDK

### Backend & Database

* Convex

## Architecture Highlights

* Server Components & Client Components
* Server Actions
* Dynamic Routing
* Authentication Middleware
* Real-Time Video Infrastructure
* Persistent Interview Storage

## Getting Started

### Prerequisites

* Node.js 18+
* npm / pnpm / yarn

### Installation

```bash
git clone <repository-url>
cd interviewhub

npm install
```

### Environment Variables

Create a `.env.local` file and configure:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CONVEX_URL=

NEXT_PUBLIC_STREAM_API_KEY=
STREAM_SECRET_KEY=
```

### Run the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Future Improvements

* AI-powered interview evaluation
* Automated feedback generation
* Question bank management
* Interview analytics dashboard
* Multi-round interview workflows

## License

This project is developed for learning and portfolio purposes.
