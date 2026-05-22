[README.md](https://github.com/user-attachments/files/28153823/README.md)
# Messenger Web App

A small messenger-style web application built with vanilla JavaScript, HTML, CSS, and Node.js.

This project was created as a learning project to practice how the frontend and backend work together in a real application. It includes user registration, login, cookie-based authentication, protected routes, chat creation, message sending, and simple JSON-based data storage.

The goal of this project was not to build a production-ready messenger, but to understand the full flow of a web app: how a user logs in, how the server checks authentication, how data is saved, and how the frontend updates the interface.

## Features

- User sign up
- User login and logout
- Cookie-based authentication
- Protected pages and routes
- Password hashing with SHA-256
- Chat list rendering
- Start a new chat with another user
- Send messages inside a chat
- Store users and chats in JSON files
- Update username, email, and password
- Basic client-server communication using `fetch`
- Frontend rendering with vanilla JavaScript

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript
- DOM manipulation
- Fetch API
- localStorage

### Backend

- Node.js
- Built-in `http` module
- Built-in `fs` module
- Built-in `crypto` module
- JSON file storage
- Cookie-based session logic

## Project Structure

```text
.
├── app.js          # Node.js server and backend routes
├── script.js       # Frontend logic
├── index.html      # Main application page
├── login.html      # Login page
├── signup.html     # Sign-up page
├── chat.html       # Static chat layout / UI reference
├── users.json      # User data storage
├── chats.json      # Chat and message data storage
├── common.css      # Shared styles
├── chat.css        # Chat page styles
└── 404.html        # Not found page
```

## How It Works

The backend is built with Node.js without Express. The server handles different routes manually using the built-in `http` module.

When a user signs up, the server saves the user in `users.json`. The password is hashed before saving. After login or sign-up, the server creates a cookie and uses it to check if the user is authenticated.

Chats and messages are stored in `chats.json`. When the frontend needs data, it sends requests to the backend using `fetch`. The server reads the JSON files, prepares the needed data, and sends it back to the browser.

