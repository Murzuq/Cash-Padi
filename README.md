# Cash Padi: AI-Powered Financial Inclusion Platform

**[View Live Demo](https://cashpadi.netlify.app)**

**Cash Padi** is a modern, full-stack web application designed to enhance financial inclusion through an intuitive, AI-powered conversational interface. It allows users to manage their finances, perform transactions, and receive personalized financial advice using both voice and text commands. The application is built with a focus on accessibility, supporting multiple languages including English, Hausa, Yoruba, and Pidgin.

---

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)

---

## About The Project

Cash Padi aims to bridge the gap in financial literacy and accessibility by providing a user-friendly platform for everyone, regardless of their technical skills or literacy level. The core of the application is a sophisticated AI assistant, powered by Google's Gemini model, which can understand and execute a wide range of financial tasks based on natural language.

From checking your balance with a simple voice command to getting advice on your spending habits, Cash Padi makes banking simpler, smarter, and more accessible.

## Key Features

- **🤖 AI-Powered Financial Assistant**: Interact with your bank account using natural voice or text commands.
- **🗣️ Multilingual Support**: Get financial advice and perform transactions in English, Hausa, Yoruba, and Pidgin.
- **🏦 Core Banking Operations**:
  - Check account balance.
  - Transfer money to other users.
  - View recent transaction history.
- **💡 Personalized Financial Insights**: The AI can analyze your spending history and provide tailored advice to help you manage your money better.
- **🎯 Savings Goals**: Create and manage micro-savings goals to save for specific needs like school fees or market expansion.
- **🧾 Bill Payments**: Easily pay for utilities and buy airtime directly through the AI assistant.
- **🎤 Customizable AI Voice**: Users can select their preferred AI voice from a list of available options in their browser.
- **🔐 Secure Authentication**: JWT-based authentication to keep user accounts and data secure.
- **📱 Responsive Design**: A clean and modern user interface built with Tailwind CSS that works seamlessly on both desktop and mobile devices.

## Application Architecture

The application follows a modern, decoupled, full-stack architecture. The frontend is a single-page application (SPA) that communicates with a backend API and Google's AI services.

```mermaid
graph TD
    subgraph "User's Device"
        A[Browser]
    end

    subgraph "Frontend (React on Netlify)"
        B[React UI Components]
        C[useFinancialAssistant Hook]
        D[Redux State]
        E[Web Speech API <br/>(STT/TTS)]
    end

    subgraph "Backend (Node.js on Render)"
        F[Express API <br/> /api/...]
        G[Mongoose]
    end

    subgraph "External Services"
        H[Google Gemini API]
        I[MongoDB Atlas]
    end

    A -- Interacts with --> B
    B -- Voice/Text Input --> C
    C -- Processes Command --> H
    H -- Function Call Request --> C
    C -- Secure API Call --> F
    F -- Authenticates & Executes --> G
    G -- CRUD Operations --> I
    I -- Returns Data --> G
    G -- Returns Result --> F
    F -- Returns Result --> C
    C -- Sends Function Result --> H
    H -- Generates Final Response --> C
    C -- Updates UI & State --> B
    C -- Updates State --> D
    C -- Speaks Response --> E
    E -- Spoken Audio --> A
```

## Built With

This project is built with a modern, full-stack JavaScript architecture.

**Frontend:**

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

**Backend:**

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) (with [Mongoose](https://mongoosejs.com/))
- [JSON Web Tokens (JWT)](https://jwt.io/)

**AI & Services:**

- [Google Gemini API](https://ai.google.dev/)

---

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- **Node.js**: Version 18.x or higher.
- **npm** or **yarn**: Comes with Node.js.
- **MongoDB**: A running instance of MongoDB (local or a cloud service like MongoDB Atlas).

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/Murzuq/cash-padi.git
    cd cash-padi
    ```

2.  **Install backend dependencies:**

    ```sh
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```sh
    cd ..
    npm install
    ```

## Environment Variables

You'll need to create two `.env` files for this project.

1.  **Backend `.env` file:**
    Create a file named `.env` in the `backend/` directory and add the following variables:

    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=5000
    ```

2.  **Frontend `.env` file:**
    Create a file named `.env` in the root directory and add your Google Gemini API key:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key
    ```

## Running the Application

1.  **Start the backend server:**
    From the `backend/` directory, run:

    ```sh
    npm start
    ```

    The backend will be running on `http://localhost:5000`.

2.  **Start the frontend development server:**
    From the root directory, run:
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## API Endpoints

The backend provides a RESTful API for handling user authentication, transactions, and data retrieval. All protected routes require a `Bearer` token in the `Authorization` header.

### Authentication (`/api/auth`)

| Method | Endpoint    | Description                       |
| :----- | :---------- | :-------------------------------- |
| `POST` | `/register` | Registers a new user.             |
| `POST` | `/login`    | Logs in a user and returns a JWT. |

### User (`/api/users`)

| Method | Endpoint                     | Description                          |
| :----- | :--------------------------- | :----------------------------------- |
| `GET`  | `/me`                        | Get the current user's profile data. |
| `GET`  | `/savings-goals`             | Get all savings goals for the user.  |
| `POST` | `/savings-goals`             | Create a new savings goal.           |
| `POST` | `/savings-goals/:id/deposit` | Deposit money into a specific goal.  |
| `GET`  | `/savings-nudge`             | Get an AI-generated savings tip.     |

### Transactions (`/api/transactions`)

| Method | Endpoint    | Description                             |
| :----- | :---------- | :-------------------------------------- |
| `POST` | `/transfer` | Transfer money to another user account. |
| `POST` | `/airtime`  | Purchase airtime for a phone number.    |
| `POST` | `/bill`     | Pay a utility bill.                     |

### Text-to-Speech (`/api/tts`)

| Method | Endpoint      | Description                            |
| :----- | :------------ | :------------------------------------- |
| `POST` | `/synthesize` | Converts text into high-quality audio. |

## Deployment

This application is designed for easy deployment on modern hosting platforms.

- **Frontend**: Can be deployed to static hosting services like Netlify, Vercel, or GitHub Pages.
- **Backend**: Can be deployed to services like Render, Heroku, or any platform that supports Node.js applications.

Make sure to configure your environment variables in the deployment service settings. For platforms like Render, you may need to set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable with the JSON content of your service account key for services like Google Cloud TTS.
