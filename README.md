# The Procrastination Museum 🏛️

Where abandoned dreams find eternal rest.

## About

A digital museum showcasing GitHub's most beautifully abandoned projects. Each repository is displayed as a piece of art in elegant frames, complete with museum-style plaques, poetic descriptions, and modern vitrine aesthetics.

## Features

- 🖼️ **Museum-quality vitrine display** with LED lighting effects
- 🎨 **Curated collections** featuring famous developers' abandoned projects
- 📊 **Smart statistics** on lost stars and unfinished business  
- 🔍 **Individual user search** with customizable abandonment filters
- 📜 **Poetic descriptions** bringing digital archaeology to life
- 🔐 **GitHub token support** for increased API limits (60 → 5000 req/hour)
- ⏱️ **Intelligent time tracking** - shows when projects were truly abandoned
- 🎯 **Refined data presentation** with semantic improvements

## Collections

Explore pre-curated galleries:
- **Hall of Fame**: Most starred abandoned projects from legendary developers
- **Abandoned Games**: Unfinished gaming dreams and interactive experiments
- **Forgotten Tools**: CLI and development tools left behind
- **Web Experiments**: Frontend projects that never shipped

## Tech Stack

- **Frontend**: React 18 (Create React App)
- **APIs**: GitHub REST API with authentication support
- **Styling**: CSS3 with custom museum aesthetics
- **Deployment**: Vercel
- **No external dependencies** - pure React implementation

## API Usage

The app supports both authenticated and non-authenticated usage:

- **Without token**: 60 requests per hour (GitHub's default limit)
- **With personal token**: 5000 requests per hour
- **Token scope**: No special permissions required - basic read access

To use with increased limits:
1. Generate a GitHub Personal Access Token at Settings → Developer settings → Personal access tokens
2. Paste it in the optional token field
3. Enjoy 5000 requests per hour for extensive museum browsing

## Live Demo

[Visit The Museum](https://procrastination-museum.vercel.app)

## Local Development

```bash
git clone https://github.com/Luis7gui/procrastination-museum.git
cd procrastination-museum
npm install
npm start
```

The app will open at `https://localhost:3000` (HTTPS enabled for GitHub OAuth compatibility).

## Project Structure

```
procrastination-museum/
├── src/
│   ├── App.js           # Main application component
│   ├── Museum.css       # Museum-themed styling
│   ├── index.js         # Entry point
│   └── index.css        # Base styles
└── public/
    └── index.html       # HTML template
```

## Key Features Explained

### Smart Abandonment Detection
Projects are considered abandoned based on:
- Last update timestamp
- Configurable time periods (1 month to 2+ years)
- Exclusion of forks
- Intelligent time formatting (days/months/years ago)

### Museum Aesthetics
- **Vitrine-style frames** with LED lighting effects
- **Golden accents** throughout the interface
- **Elegant typography** mixing serif and sans-serif fonts
- **Hover animations** and smooth transitions
- **Responsive grid** adapting to different screen sizes

### Data Presentation
- **Semantic information**: "Created in 2017" instead of "2017 BORN"
- **Smart number formatting**: 1.2k instead of 1200
- **Contextual descriptions** with poetic flair
- **Hierarchical information design** prioritizing description and poetry

## Development Notes

This project was built for the "For the Love of Code 2025" hackathon, focusing on creative presentation over complex architecture. The current implementation uses a single-component architecture which could benefit from refactoring for larger-scale development.

### Known Limitations
- Single monolithic component (planned for refactoring)
- No persistent caching (data reloads on refresh)
- Limited error recovery mechanisms
- No automated testing coverage

### Future Enhancements
- Component modularization
- Persistent caching with IndexedDB
- Additional curated collections
- Social sharing capabilities
- Export functionality
- Advanced filtering options

## Contributing

This is a hackathon project, but contributions are welcome for post-competition development. Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - Feel free to explore, modify, and showcase your own abandoned dreams.

---

*"In the digital realm, even abandoned code tells a story of ambition, creativity, and the human spirit."*