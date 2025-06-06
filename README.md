# Sunvoy Reverse Engineering Assignment

This project is a Node.js script to reverse engineer a legacy web application hosted at [https://challenge.sunvoy.com](https://challenge.sunvoy.com). It retrieves a list of users and the currently authenticated user's details.

## ✅ Features

- Logs in to the legacy site using `demo@example.org` / `test`
- Fetches user list via internal API
- Fetches current user info from `/settings`
- Caches authentication cookies for reuse (persistent login)
- Outputs a formatted `users.json` file with 10 entries

## 🧠 How It Works

The script mimics browser behavior to log in, reuses cookies, and parses HTML responses to extract information.

## 🔧 Requirements

- Node.js (LTS version, v18+ recommended)
- npm

## 🚀 How to Run

```bash
npm install
npm start

