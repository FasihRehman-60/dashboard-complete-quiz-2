#  NewsWave 

### 🧩 Overview

**NewsWave** is a modern full-stack MERN (MongoDB, Express, React, Node.js) application that delivers the latest news articles across multiple categories — including **Business**, **Sports**, **Entertainment**, **Technology**, **Health**, and **Science**.  

Users can **sign up**, **sign in**, **browse live news feeds**, and **explore curated content** in a clean, elegant, and responsive interface.

This project demonstrates:
- 🔐 Secure authentication (JWT + bcrypt)
- 🌐 RESTful API structure
- ⚛️ React + Tailwind modern frontend
- 📱 Fully responsive design for all devices

---

## Images of Project
### 🖥️ Frontend Folder Structure
![Frontend Folder Structure](./images/frontend-structure.png)
### 🧠 Backend Folder Structure
![Backend Folder Structure](./images/backend-structure.png)
### DashBoard-Page
![DashBoard Picture](./images/dashboard-page.png)
### Home-Page
![HomePage Picture](./images/HomePage.png)
### About-Page
![About-Page](./images/About-Page.png)
### Services-Page
![Services-Page](./images/Services-page.png)
### Contact-Page
![Contact-Page](./images/Contact-Page.png)
### GET_API
![API-Page](./images/Get-Api-page.png)


---
## 🚀 Setup Instructions

### Clone the Repository
git clone https://github.com/FasihRehman-60/dashboard-complete-quiz-2

cd newswave

## Backend Setup
Navigate to the backend folder:

cd backend

### Install dependencies:
npm install

## **Rename .env.txt to .env**

### Example .env content in backend folder:

### Server Configuration
PORT=5000

### MongoDB Connection
MONGO_URI=mongodb://127.0.0.1:27017/newswave

### JWT Secret Key (Keep this private!)
JWT_SECRET=your_secret_key

### API Base URL (used by frontend)
VITE_API_BASE_URL=http://localhost:5000/api

### for contact-form and reset-password-Link
EMAIL=mirza.fasih99@gmail.com
EMAIL_PASSWORD=you_16_digit_passcode

### using for related-news-show upon search
FRONTEND_URL=http://localhost:5173
NEWS_API_KEY=api_key

### Run the backend server:
nodemon src/server.js OR npm run dev

Your backend will start on: http://localhost:5000

## Frontend Setup

Open a new terminal and navigate to the frontend folder:

cd frontend

### Install dependencies:
npm install

### Example .env content in frontend folder:
VITE_NEWS_API_KEY=Your_NewsApi_key

VITE_API_BASE_URL=http://localhost:5000/api

### Run the frontend
npm run dev

#### Frontend will be available at:
http://localhost:5173

## 📂 Folder Overview
Folder Description:
backend/src/controllers	         Contains all logic for handling routes and API requests

backend/src/routes	             Contains API route definitions for authentication, news, etc.

backend/src/models	             Mongoose schemas for MongoDB collections

frontend/src/pages	             All main pages like Home, Dashboard, and Services

frontend/src/components	         Reusable UI components such as Navbar, Footer, NewsCard, etc.

frontend/src/utils	             Utility functions and API setup (like api.js)

### How It Works

### Authentication Flow
- Users Sign Up with full validation
- Passwords hashed using bcrypt
- On login, JWT token stored in sessionStorage
- Protected routes check & validate JWT

## Pages Overview

### Main Pages

 Page Description:

**Home Page**      Displays top headlines, featured and trending news. Includes search, filters, and category browsing.

**Services Page**  Explains all the key features and services offered by **NewsWave**, including filtering, searching, social sharing, bookmarking, and more.

**Dashboard**      Personalized dashboard for logged-in users showing their liked and saved articles, recent reads, and profile info.

**Sign In / Sign Up Page** Allows users to register or log into the platform. Includes a warm welcome message and NewsWave branding.                                  |

## News Features

| Feature                         | Description                                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Category Filtering**          | Browse news by categories like *Sports*, *Technology*, *Business*, and subcategories (*Football*, *Cricket*, etc.). |
| **Search with Suggestions**     | Provides live search suggestions as the user types.                                                                 |
| **Share to Social Media**       | Instantly share news articles on platforms like Facebook, Twitter, and LinkedIn.                                    |
| **Infinite Scroll / Load More** | Automatically loads more news as you scroll down.                                                                   |
| **Estimated Reading Time**      | Displays how long it takes to read each article.                                                                    |
| **Trending News Section**       | Highlights the most popular and trending articles.                                                                  |
| **Related News Section**        | Suggests similar articles based on the one being viewed.                                                            |
| **Bookmarks / Save for Later**  | Users can save favorite articles to read later.                                                                     |
| **Like / Upvote System**        | Engage with content by liking or upvoting articles.                                                                 |
| **API KEY AVAILABLE**           | Fetch the latest news using our Public API. Get articles by category, company, source, date, or search query.       |

## Future Improvements
✔️ Completed
- Services section fully fixed and improved
- Forget Password feature implemented
- Contact form fully working with backend
- UI Improvements across all pages
- Full responsive redesign with Tailwind CSS
- API Generation

### 🧑‍💻 Author

**Developed by:** Fasih Ur Rehman  

---
⭐ *NewsWave — Stay Informed. Stay Inspired.*  
