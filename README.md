# Poker Settler 🃏

A modern web application for calculating poker game settlements. Track buy-ins, chips, and automatically determine who pays whom after the game.

## ✨ Features

- **Player Management**: Add players with initial buy-ins
- **Chip Tracking**: Add/remove chips during the game
- **Automatic Settlements**: Calculate optimal payment routes between players
- **Shareable Games**: Generate unique links for each game
- **Game History**: View previous games and outcomes
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Beautiful dark theme with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd poker-settler
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Use

### Starting a New Game

1. Click "Start New Game" on the homepage
2. Add players with their initial buy-ins
3. Use the chip management section to add/remove chips during the game
4. Enter final amounts when the game ends
5. Click "Calculate Settlements" to see who pays whom

### Game Features

- **Chip Management**: Add or remove chips from any player during the game
- **Real-time Totals**: See the total pot, outcomes, and differences
- **Smart Settlements**: Automatically calculates the minimum number of transactions
- **Shareable Links**: Copy and share the game URL with other players

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── game/           # Game pages
│   ├── history/        # Game history
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── types/              # TypeScript type definitions
└── components/         # Reusable components
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically on every push

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Environment Variables

No environment variables are required for basic functionality. The app works entirely in the browser with local storage.

## 🎨 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks
- **Deployment**: Vercel-ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/poker-settler/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🎯 Roadmap

- [ ] Database integration for persistent storage
- [ ] User authentication and accounts
- [ ] Multiple game types (tournament, cash game)
- [ ] Export game results to PDF
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration features

---

Built with ❤️ using Next.js and Tailwind CSS
