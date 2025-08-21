# 🎬 CinemaCache

A modern, responsive movie discovery application that lets users explore the world of cinema with ease.

![CinemaCache Demo](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=CinemaCache+Screenshot)

## 🌟 Overview

CinemaCache is a sleek movie browsing application designed for film enthusiasts who want to stay current with trending movies and discover new favorites. Built with performance and user experience as top priorities, it delivers a fast, intuitive interface that works seamlessly across all devices.

**Live Demo:** [https://cinema-cache.vercel.app/](https://cinema-cache.vercel.app/)

## ✨ Features

### 🎯 Core Functionality
- **Trending Movies**: Browse the latest popular and trending films
- **Advanced Search**: Find movies by title with real-time suggestions
- **Detailed Views**: Access comprehensive movie information including:
  - High-quality posters and backdrop images
  - Synopsis and plot details
  - IMDb ratings and user scores
  - Release dates and runtime
  - Cast and crew information
  - Genre classifications

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Fast Loading**: Optimized images and efficient data fetching
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Accessibility**: Screen reader friendly with proper ARIA labels

## 🛠 Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React.js** | Frontend Framework | ^18.0.0 |
| **Tailwind CSS** | Styling & Design System | ^3.0.0 |
| **React Router** | Navigation | ^6.0.0 |
| **Axios** | HTTP Client | ^1.0.0 |
| **Vercel** | Deployment Platform | Latest |

## 🚀 Quick Start

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CinemaCache.git
   cd CinemaCache
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your movie database API key:
   ```env
   REACT_APP_TMDB_API_KEY=your_api_key_here
   REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
CinemaCache/
├── public/                 # Static assets and favicon
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/        # Shared components (Button, Modal, etc.)
│   │   ├── layout/        # Layout components (Header, Footer)
│   │   └── movie/         # Movie-specific components
│   ├── pages/             # Route components
│   │   ├── Home.jsx
│   │   ├── MovieDetail.jsx
│   │   └── Search.jsx
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API calls and external services
│   ├── utils/             # Helper functions and constants
│   ├── styles/            # Global styles and Tailwind config
│   └── App.jsx            # Main application component
├── .env.example           # Environment variables template
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## 🌐 API Integration

This project uses [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) for movie data.

### Getting API Access
1. Create a free account at [TMDB](https://www.themoviedb.org/)
2. Navigate to Settings → API
3. Request an API key
4. Add the key to your `.env.local` file

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Alternative Deployments
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use `gh-pages` package
- **Railway**: Connect repository and deploy

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to your branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design principles

### Issues
- Use the issue templates provided
- Include screenshots for UI-related bugs
- Provide reproduction steps for bugs

## 🐛 Known Issues & Roadmap

### Current Limitations
- Search limited to movie titles only
- No user authentication/favorites system
- Limited to English language content

### Upcoming Features
- [ ] User accounts and watchlists
- [ ] Movie recommendations
- [ ] Advanced filtering options
- [ ] Multi-language support
- [ ] Offline functionality
- [ ] Movie trailers integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Tailwind CSS](https://tailwindcss.com/) for the excellent utility-first CSS framework
- [React](https://reactjs.org/) community for the amazing ecosystem

## 📧 Contact

**Your Name** - [@yourusername](https://twitter.com/yourusername) - your.email@example.com

Project Link: [https://github.com/yourusername/CinemaCache](https://github.com/yourusername/CinemaCache)

---

<div align="center">
  <p>Made by Justin Luft</p>
  <p>⭐ Star this repo if you find it useful!</p>
</div>
