# Study Buddy

> A modern MERN stack productivity app for tracking study sessions, coding practice, and personal progress, with built-in analytics and AI-powered insights.

---

## 🚀 Features

- **User Authentication:** Register, login, and secure your data with JWT and cookies.
- **Task & Study Log Management:** Add, edit, and delete daily study logs with descriptions and durations.
- **Global State with Context API:** All tasks and statistics are available across the app.
- **Real-Time Analytics:** Instantly see your total study time, total tasks, last activity, and average durations (weekly, monthly, 6-monthly, yearly, all-time).
- **AI Insights (Local):** Get Gemini-style, context-aware study tips and performance summaries—no external API required.
- **Responsive UI:** Clean, modern design for desktop and mobile.

## 🛠️ Tech Stack

- **Frontend:** React, Axios, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT, Cookies

## 🏁 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Dilraj1602/Study-Buddy.git
   cd Study-Buddy
   ```

2. **Install server dependencies:**
   ```sh
   cd server
   npm install
   # or
   yarn install
   ```

3. **Install client dependencies:**
   ```sh
   cd ../client
   npm install
   # or
   yarn install
   ```

4. **Set up environment variables:**
   - In `server/`, create a `.env` file:
     ```env
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     PORT=4000
     ```

5. **Start the backend server:**
   ```sh
   cd server
   npm start
   # or
   yarn start
   ```

6. **Start the frontend app:**
   ```sh
   cd ../client
   npm start
   # or
   yarn start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000)

## 📖 Usage

- Register or log in to your account.
- Add your daily study tasks and durations.
- View, edit, or delete logs from the dashboard.
- Filter/search logs by date or keywords.
- See your average study duration (weekly, monthly, 6-monthly, yearly, all-time).
- View total study time, total tasks, and last activity in the Study Statistics tab.
- Get AI-powered insights and recommendations based on your study data.

## 📁 Folder Structure

```
Study-Buddy/
  client/      # React frontend
  server/      # Node.js/Express backend
```

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## 📜 License

[MIT](LICENSE)

---

**Made with ❤️ for productivity and progress!**

## 🧭 Future Goals

- **User Streak Graph:** Visualize your study streaks with interactive graphs to motivate daily consistency.
- **Daily Study Limit:** Set and track a daily study duration limit, with notifications when you reach or exceed your goal.
