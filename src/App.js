import React, { useState, useEffect } from 'react';
import './Museum.css';


function App() {
  const [username, setUsername] = useState('');
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Add subtle museum ambience
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE');
    audio.loop = true;
    audio.volume = 0.05;
    // audio.play(); // Uncomment if you want ambient sound
  }, []);

  const findAbandonedProjects = async () => {
    setLoading(true);
    try {
      console.log('Fetching repos for:', username);

      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
      // Note: direction=asc gets the OLDEST updated first!

      const repos = await response.json();

      console.log('Total repos found:', repos.length);

      // For now, just show all repos sorted by least recently updated
      const abandoned = repos.filter(repo => !repo.fork);

      console.log('Repos to display:', abandoned.length);

      setExhibits(abandoned);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    }
    setLoading(false);
  };

  const getPoetryDescription = (repo) => {
    const years = Math.floor((new Date() - new Date(repo.updated_at)) / (365 * 24 * 60 * 60 * 1000));
    const phrases = [
      `Abandoned ${years} years ago, this masterpiece awaits resurrection.`,
      `${repo.commit_count || 'Countless'} commits lie dormant in eternal slumber.`,
      `Once loved by ${repo.stargazers_count} souls, now forgotten by time.`,
      `The developer's ambition exceeded their dedication.`
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  return (
    <div className="museum">
      <header className="museum-entrance">
        <h1>The Procrastination Museum</h1>
        <p className="tagLine">Where abandoned dreams find eternal rest</p>

        <div className="search-section">
          <input
            type="text"
            placeholder="Enter GitHub username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && findAbandonedProjects()}
          />
          <button onClick={findAbandonedProjects}>
            Explore Collection
          </button>
        </div>
      </header>

      {loading && <div className="loading">Curating exhibition...</div>}

      {exhibits.length > 0 && (
        <div className="museum-stats">
          <div className="stat">
            <span className="stat-number">{exhibits.length}</span>
            <span className="stat-label">Abandoned Dreams</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {exhibits.reduce((sum, repo) => sum + repo.stargazers_count, 0).toLocaleString()}
            </span>
            <span className="stat-label">Lost Stars</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {exhibits.reduce((sum, repo) => sum + repo.open_issues_count, 0)}
            </span>
            <span className="stat-label">Unfinished Business</span>
          </div>
        </div>
      )}

      <div className="gallery">
        {exhibits.length === 0 && !loading && username && (
          <p className="no-exhibits">No abandoned projects found. This developer finishes what they start!</p>
        )}

        {exhibits.map(repo => (
          <div key={repo.id} className="exihibit">
            <div className="frame">
              <h3>{repo.name}</h3>
              <p className="description">{repo.description || "No artist's statement provided"}</p>
              <p className="poetry">{getPoetryDescription(repo)}</p>
              <div className="plaque">
                <p>Created: {new Date(repo.created_at).getFullYear()}</p>
                <p>Last Touched: {new Date(repo.created_at).toLocaleDateString()}</p>
                <p>{repo.stargazers_count} admirers</p>
                <p>{repo.open_issues_count} unresolved regrets</p>
              </div>
              <a
                href={repo.html_url}
                target="blank"
                rel="noopener noreferrer"
                className="visit-tomb"
              >
                Visit the ruins →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;