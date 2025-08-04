# StudyTrack

A full-stack web application to help you track your study sessions, coding practice, and progress over time.

## Features
- User authentication (register, login, logout)
- Add, edit, and delete daily study logs
- Track tasks with descriptions and durations
- Responsive and modern UI

## Tech Stack
- **Frontend:** React, Axios, React Router
- **Backend:** Node.js, Express, Mongoose, MongoDB
- **Authentication:** JWT, Cookies

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Dilraj1602/StudyTrack
   cd StudyTrack
   ```

2. **Install server dependencies:**
   ```sh
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
     MONGO_URI=
     JWT_SECRET=
     PORT=4000
     ```
   - Adjust `MONGO_URI` if using MongoDB Atlas.

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

## Usage
- Register a new account or log in.
- Add your daily study tasks, coding practice, and durations.
- View, edit, or delete logs from the dashboard.
- Filter and search logs by date or keywords.

## Folder Structure
```
StudyTrack/
  client/      # React frontend
  server/      # Node.js/Express backend
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License
[MIT](LICENSE)

---

**Made with ❤️ for productivity and progress!**

## Future Goals
- **Chatbot Integration:** Add an interactive chatbot to answer user questions, provide study tips, and guide users through the app.
- **AI-Powered Insights:** Integrate AI to automatically summarize your study stats and performance, offering personalized tips to improve learning efficiency.
- **Wellness Warnings:** Use AI to detect overwork patterns and warn users if they are studying too much, encouraging healthy study habits.
- **Smart Recommendations:** Suggest optimal study schedules, break times, and resources based on user data and progress.

