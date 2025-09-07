import React, { useState } from 'react';
import './Museum.css';

const CURATED_COLLECTIONS = {
  famous: {
    title: "Hall of Fame",
    description: "Most starred abandoned projects",
    users: ["torvalds", "gvanrossum", "antirez", "tj", "sindresorhus"]
  },
  gamedev: {
    title: "Abandoned Games",
    description: "Unfinished gaming dreams",
    users: ["photonstorm", "kittykatattack", "liabru", "goldfire"]
  },
  tools: {
    title: "Forgotten Tools",
    description: "CLI and dev tools left behind",
    users: ["tj", "sindresorhus", "substack", "remy"]
  },
  webdev: {
    title: "Web Experiments",
    description: "Frontend projects that never shipped",
    users: ["addyosmani", "paulirish", "chriscoyier", "wesbos"]
  }
};

function App() {
  const [username, setUsername] = useState('');
  const [exhibits, setExhibits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState(6); // months
  const [error, setError] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionRepos, setCollectionRepos] = useState([]);

  const findAbandonedProjects = async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    setSelectedCollection(null);
    setCollectionRepos([]);  // Clear collection when searching manually

    try {
      console.log('Fetching repos for:', username);
      console.log('Filter period:', timeFilter, 'months');
      
      const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
      const repos = await response.json();
      
      console.log('Total repos found:', repos.length);
      
      // Use the timeFilter state
      const filterDate = new Date();
      filterDate.setMonth(filterDate.getMonth() - timeFilter);
      
      const abandoned = repos.filter(repo => {
        const lastUpdate = new Date(repo.updated_at);
        return !repo.fork && lastUpdate < filterDate;
      });
      
      // Sort by most stars first
      abandoned.sort((a, b) => b.stargazers_count - a.stargazers_count);
      
      console.log('Abandoned repos found:', abandoned.length);
      
      setExhibits(abandoned);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setError('Failed to fetch repositories. Please check the username or try again.');
      setExhibits([]);
    }
    setLoading(false);
  };

  const loadCollection = async (collection) => {
    setLoading(true);
    setError('');
    setSelectedCollection(collection);
    setUsername(''); // Clear username input
    let allRepos = [];
    
    for (const user of CURATED_COLLECTIONS[collection].users) {
      try {
        await new Promise(resolve=> setTimeout(resolve, 200));

        const response = await fetch(`https://api.github.com/users/${user}/repos?per_page=100`);
        const repos = await response.json();
        
        const filterDate = new Date();
        filterDate.setMonth(filterDate.getMonth() - timeFilter);
        
        const abandoned = repos.filter(repo => {
          const lastUpdate = new Date(repo.updated_at);
          return !repo.fork && lastUpdate < filterDate;
        }).map(repo => ({...repo, owner_name: user})); // Add owner name
        
        allRepos = [...allRepos, ...abandoned];
      } catch (error) {
        console.error(`Failed to fetch ${user}:`, error);
      }
    }
    
    // Sort by stars
    allRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    setCollectionRepos(allRepos.slice(0, 12)); // Top 12
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

  const handleFilterChange = (months) => {
    setTimeFilter(months);
    if (username) {
      findAbandonedProjects(); // Re-fetch when filter changes
    }
    if (selectedCollection) {
      loadCollection(selectedCollection); // Re-fetch collection with new filter
    }
  };

  // Determine which repos to display
  const reposToDisplay = collectionRepos.length > 0 ? collectionRepos : exhibits;
  
  // Calculate statistics for the current display
  const totalStars = reposToDisplay.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalIssues = reposToDisplay.reduce((sum, repo) => sum + repo.open_issues_count, 0);

  return (
    <div className="museum">
      <header className="museum-entrance">
        <h1>The Procrastination Museum</h1>
        <p className="tagline">Where abandoned dreams find eternal rest</p>

        <div className="search-section">
          <input
            type="text"
            placeholder="Enter GitHub username..."
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && findAbandonedProjects()}
          />
          <button onClick={findAbandonedProjects}>
            Explore Collection
          </button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center', 
          alignItems: 'center',
          margin: '1rem 0',
          gap: '10px'
        }}>
          <label style={{ color: '#d4af37' }}>Show projects abandoned for:</label>
          <select 
            value={timeFilter} 
            onChange={(e) => handleFilterChange(Number(e.target.value))}
            style={{
              background: '#1a1a1a',
              color: '#d4af37', 
              border: '1px solid #d4af37',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            <option value={1}>1 month</option>
            <option value={3}>3 months</option>
            <option value={6}>6 months</option>
            <option value={12}>1 year</option>
            <option value={24}>2 years</option>
          </select>
        </div>
      </header>

      {loading && <div className="loading">Curating exhibition...</div>}
      {error && !selectedCollection && <div className="error-message">{error}</div>}

      {/* Curated Collections */}
      {!username && !selectedCollection && (
        <div className="collections">
          <h2 style={{ textAlign: 'center', color: '#d4af37', margin: '2rem 0' }}>
            Explore Curated Collections
          </h2>
          <div className="collection-grid">
            {Object.entries(CURATED_COLLECTIONS).map(([key, collection]) => (
              <div 
                key={key} 
                className="collection-card"
                onClick={() => loadCollection(key)}
              >
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedCollection && (
        <div style={{
          textAlign: 'center',
          margin: '2rem 0',
          padding: '1rem',
          background: 'rgba(212, 175, 55, 0.05)',
          borderRadius: '8px'
        }}>
          <h2 style={{ color: '#d4af37' }}>
            {CURATED_COLLECTIONS[selectedCollection].title}
          </h2>
          <p style={{ color: '#999', marginBottom: '1rem' }}>
            Viewing curated collection
          </p>
          <button 
            onClick={() => {
              setSelectedCollection(null);
              setCollectionRepos([]);
              setExhibits([]); 
              setUsername('');
              setError('');
            }}
            style={{
              background: 'transparent',
              border: '1px solid #d4af37',
              color: '#d4af37',
              padding: '8px 16px',
              cursor: 'pointer',
              BorderRadius: '4px'
            }}
          >
            ← Back to Collections
          </button>
        </div>
      )}

      {/* Statistics Section - Fixed */}
      {(reposToDisplay.length > 0) && (
        <div className="museum-stats">
          <div className="stat">
            <span className="stat-number">{reposToDisplay.length}</span>
            <span className="stat-label">Abandoned Dreams</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {totalStars.toLocaleString()}
            </span>
            <span className="stat-label">Lost Stars</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {totalIssues}
            </span>
            <span className="stat-label">Unfinished Business</span>
          </div>
        </div>
      )}

      <div className="gallery">
        {reposToDisplay.length === 0 && !loading && username && (
          <p className="no-exhibits">No abandoned projects found. This developer finishes what they start!</p>
        )}

        {/* Unified repository display */}
        {reposToDisplay.map(repo => (
          <div key={repo.id} className="exhibit">
            <div className="frame">
              <h3>{repo.name}</h3>
              {repo.owner_name && <p className="owner">by {repo.owner_name}</p>}
              <p className="description">{repo.description || "No artist's statement provided"}</p>
              <p className="poetry">{getPoetryDescription(repo)}</p>
              <div className="plaque">
                <p>Created: {new Date(repo.created_at).getFullYear()}</p>
                <p>Last Touched: {new Date(repo.updated_at).toLocaleDateString()}</p>
                <p>{repo.stargazers_count} admirers</p>
                <p>{repo.open_issues_count} unresolved regrets</p>
              </div>
              
              <a
                href={repo.html_url}
                target="_blank"
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