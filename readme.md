# Draw-Guess - Multiplayer Drawing & Guessing Game

A real-time multiplayer game where players take turns drawing and guessing words.

## Features

- Real-time drawing with multiple players
- Chat system for guessing words
- Points system based on guessing speed
- Customizable game settings
- Timer-based rounds
- Multiple rounds support

## Tech Stack

- **Frontend**: React.js, Redux, TailwindCSS
- **Backend**: Node.js, Express, Socket.IO
- **Build Tool**: Vite

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/skribble.git
cd Draw-Guess
```

2. Install dependencies:
```bash
# Install backend dependencies
cd Server
npm install

# Install frontend dependencies
cd ../Client
npm install
```

3. Create environment files:

Backend `.env`:
```env
PORT=7040
```

Frontend `.env`:
```env
VITE_API_URL=http://localhost:7040
```

## Running the Application

1. Start the backend server:
```bash
cd Server
npx nodemon
```

2. In a new terminal, start the frontend:
```bash
cd Client
npm run dev
```

## Game Rules

1. One player is selected to draw
2. Other players try to guess the word
3. Points are awarded based on how quickly players guess correctly
4. Rounds continue until all players have had a chance to draw

## Points System

- First to guess: 100 points
- Second: 90 points
- Third: 70 points
- And so on...

## Available Scripts

### Backend
- `npx nodemon`: Starts the server

### Frontend
- `npm run dev`: Starts development server
