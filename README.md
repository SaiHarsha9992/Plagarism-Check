# Plagarism Check

### What is the features?

* 🔐 **Firebase Authentication** – Secure login using Google accounts.
* 📝 **Code Submission Interface** – Built-in Monaco Editor for writing and submitting code in C++, Java, or Python.
* 🚀 **Online Code Execution** – Real-time code compilation and test case execution using an API-based compiler.
* 🧠 **Plagiarism Detection** – Backend engine compares submitted code for structural and logical similarities.
* 📊 **Admin Dashboard** – View all submissions, search by Code ID, and run plagiarism checks.
* 🌗 **Light/Dark Mode** – User-friendly UI with theme toggle.
* ⏳ **Auto Save & Countdown** – Local draft saving and optional test timer for exam environments.
* 📧 **Email Notifications** – After submission, results are sent to the user’s registered email.\\

### Tech Stack:

* **Frontend**: Next.js, Tailwind CSS, Monaco Editor, Firebase Auth
* **Backend**: FastAPI / Express.js (plagiarism detection logic), MongoDB, ChromaDB (optional vector store)
* **Compiler API**: RapidAPI-based judge or custom execution service
* **Authentication**: Firebase
* **Deployment**: Render / Vercel / Dockerized Setup

### Modules:

* `/submit` – Authenticated page for test takers to write and submit code
* `/results` – Displays confirmation and result notification
* `/admin/dashboard` – Admin-only route for monitoring and analyzing submissions
* `/api` – Contains routes for running code, storing results, and fetching submission data

### Use Case:

Ideal for **coding tests, online technical assessments, and university programming assignments**, where code originality matters. It automates code submission handling and provides tools for detecting potential cheating or code reuse.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.
