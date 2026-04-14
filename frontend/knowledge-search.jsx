import React, { useState } from 'react';

const KnowledgeSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  const mockResults = [
    {
      id: 1,
      title: 'Customer Acquisition Cost (CAC)',
      domain: 'marketing',
      relevance: 0.95,
      description: 'The cost to acquire one new customer through marketing efforts',
      concepts: ['Marketing', 'Finance', 'Metrics'],
      source: 'Marketing Conversation #12'
    },
    {
      id: 2,
      title: 'Unit Economics',
      domain: 'finance',
      relevance: 0.88,
      description: 'Analysis of profit/loss at the individual customer level',
      concepts: ['Finance', 'Pricing', 'Growth'],
      source: 'Financial Planning Session #5'
    },
    {
      id: 3,
      title: 'LTV/CAC Ratio',
      domain: 'finance',
      relevance: 0.85,
      description: 'Lifetime value to customer acquisition cost ratio for business health',
      concepts: ['Finance', 'Marketing', 'Strategy'],
      source: 'Strategic Review #8'
    },
    {
      id: 4,
      title: 'Customer Retention Strategy',
      domain: 'customer_success',
      relevance: 0.82,
      description: 'Methods to reduce churn and increase customer lifetime value',
      concepts: ['Customer Success', 'Strategy', 'Operations'],
      source: 'Retention Planning #3'
    },
    {
      id: 5,
      title: 'Pricing Strategy',
      domain: 'pricing',
      relevance: 0.78,
      description: 'Framework for setting product prices to maximize revenue',
      concepts: ['Pricing', 'Finance', 'Marketing'],
      source: 'Pricing Workshop #2'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        const filtered = mockResults.filter(r =>
          (selectedDomain === 'all' || r.domain === selectedDomain) &&
          (r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           r.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setSearchResults(filtered.length > 0 ? filtered : mockResults.slice(0, 3));
        setIsSearching(false);
      }, 600);
    }
  };

  const getDomainColor = (domain) => {
    const colors = {
      marketing: '#f59e0b',
      finance: '#3b82f6',
      customer_success: '#10b981',
      pricing: '#ec4899',
      product: '#8b5cf6',
      operations: '#06b6d4'
    };
    return colors[domain] || '#60a5fa';
  };

  const domains = [
    { value: 'all', label: 'All Domains' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'customer_success', label: 'Customer Success' },
    { value: 'pricing', label: 'Pricing' },
    { value: 'product', label: 'Product' },
    { value: 'operations', label: 'Operations' }
  ];

  return (
    <div className="knowledge-search">
      <div className="background-gradient"></div>
      <div className="animated-grid"></div>

      <div className="search-container">
        {/* Header */}
        <header className="search-header">
          <h1>Knowledge Search</h1>
          <p>Explore Finn's learned concepts and expertise across all domains</p>
        </header>

        {/* Search Box */}
        <section className="search-box">
          <form onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search concepts, strategies, metrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Domain Filter */}
            <div className="filter-tabs">
              {domains.map(domain => (
                <button
                  key={domain.value}
                  type="button"
                  className={`filter-tab ${selectedDomain === domain.value ? 'active' : ''}`}
                  onClick={() => setSelectedDomain(domain.value)}
                >
                  {domain.label}
                </button>
              ))}
            </div>

            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </section>

        {/* Results */}
        <section className="search-results">
          {isSearching ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Searching knowledge base...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="results-header">
                <h2>Results ({searchResults.length})</h2>
                <p className="result-quality">Sorted by relevance</p>
              </div>

              <div className="results-list">
                {searchResults.map((result) => (
                  <div key={result.id} className="result-card">
                    <div className="result-header">
                      <h3>{result.title}</h3>
                      <div className="result-meta">
                        <span
                          className="domain-badge"
                          style={{
                            background: getDomainColor(result.domain) + '33',
                            color: getDomainColor(result.domain)
                          }}
                        >
                          {result.domain}
                        </span>
                        <span className="relevance-score">
                          {Math.round(result.relevance * 100)}% relevant
                        </span>
                      </div>
                    </div>

                    <p className="result-description">{result.description}</p>

                    <div className="relevance-bar">
                      <div
                        className="relevance-fill"
                        style={{
                          width: `${result.relevance * 100}%`,
                          background: result.relevance > 0.8
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : result.relevance > 0.7
                            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                            : 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                        }}
                      ></div>
                    </div>

                    <div className="result-footer">
                      <div className="concepts">
                        {result.concepts.map((concept, i) => (
                          <span key={i} className="concept-tag">{concept}</span>
                        ))}
                      </div>
                      <span className="source">{result.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : searchQuery ? (
            <div className="no-results">
              <span className="empty-icon">🔍</span>
              <h3>No results found</h3>
              <p>Try searching with different keywords or broader terms</p>
            </div>
          ) : (
            <div className="initial-state">
              <span className="icon">💡</span>
              <h3>Start Exploring</h3>
              <p>Search Finn's knowledge base to discover learned concepts and expertise</p>
              <div className="suggested-searches">
                <p className="label">Popular searches:</p>
                <div className="tags">
                  {['CAC', 'Unit Economics', 'Pricing Strategy', 'Customer Retention', 'Growth'].map(tag => (
                    <button
                      key={tag}
                      className="suggested-tag"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <style>{`
        .knowledge-search {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%);
          min-height: 100vh;
          color: #e0e6ff;
          position: relative;
          overflow-x: hidden;
        }

        .background-gradient {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .animated-grid {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
          z-index: 1;
        }

        .search-container {
          position: relative;
          z-index: 10;
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 20px;
        }

        .search-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .search-header h1 {
          font-size: 42px;
          font-weight: 900;
          margin: 0 0 12px 0;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .search-header p {
          font-size: 16px;
          color: #a5b4fc;
          margin: 0;
        }

        .search-box {
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.8) 0%, rgba(20, 28, 60, 0.6) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 16px;
          padding: 32px;
          backdrop-filter: blur(10px);
          margin-bottom: 40px;
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.2);
        }

        .search-box form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          font-size: 20px;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 16px 16px 16px 50px;
          background: rgba(15, 23, 41, 0.6);
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 10px;
          color: #e0e6ff;
          font-size: 16px;
          font-family: inherit;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: rgba(59, 130, 246, 0.6);
          background: rgba(15, 23, 41, 0.8);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
        }

        .search-input::placeholder {
          color: #6b7280;
        }

        .clear-btn {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          color: #6b7280;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          color: #e0e6ff;
        }

        .filter-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 8px 14px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 6px;
          color: #a5b4fc;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .filter-tab:hover {
          background: rgba(59, 130, 246, 0.2);
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border-color: rgba(59, 130, 246, 0.5);
        }

        .search-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(59, 130, 246, 0.3);
        }

        .search-results {
          min-height: 200px;
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 60px 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(59, 130, 246, 0.2);
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading p {
          color: #a5b4fc;
          font-size: 14px;
        }

        .results-header {
          margin-bottom: 20px;
        }

        .results-header h2 {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: #60a5fa;
        }

        .result-quality {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        .results-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .result-card {
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.6) 0%, rgba(20, 28, 60, 0.4) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .result-card:hover {
          border-color: rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.8) 0%, rgba(20, 28, 60, 0.6) 100%);
          transform: translateX(4px);
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 12px;
        }

        .result-header h3 {
          margin: 0;
          font-size: 16px;
          color: #e0e6ff;
          flex: 1;
        }

        .result-meta {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .domain-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .relevance-score {
          font-size: 11px;
          color: #a5b4fc;
          font-weight: 600;
          white-space: nowrap;
        }

        .result-description {
          font-size: 13px;
          color: #cbd5e1;
          margin: 0 0 12px 0;
          line-height: 1.5;
        }

        .relevance-bar {
          width: 100%;
          height: 4px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .relevance-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        .result-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .concepts {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .concept-tag {
          display: inline-block;
          padding: 4px 8px;
          background: rgba(139, 92, 246, 0.2);
          color: #a5b4fc;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
        }

        .source {
          font-size: 11px;
          color: #6b7280;
          white-space: nowrap;
        }

        .no-results,
        .initial-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .empty-icon,
        .icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .no-results h3,
        .initial-state h3 {
          font-size: 20px;
          margin: 0 0 8px 0;
          color: #e0e6ff;
        }

        .no-results p,
        .initial-state p {
          color: #a5b4fc;
          font-size: 14px;
          margin: 0 0 20px 0;
          max-width: 400px;
        }

        .suggested-searches {
          margin-top: 24px;
        }

        .suggested-searches .label {
          font-size: 12px;
          color: #a5b4fc;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 12px;
          display: block;
        }

        .tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .suggested-tag {
          padding: 8px 14px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 6px;
          color: #60a5fa;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .suggested-tag:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.4);
          color: #93c5fd;
        }

        @media (max-width: 640px) {
          .search-container {
            padding: 40px 16px;
          }

          .search-header h1 {
            font-size: 28px;
          }

          .search-box {
            padding: 20px;
          }

          .result-header {
            flex-direction: column;
          }

          .result-meta {
            width: 100%;
            justify-content: space-between;
          }

          .result-footer {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default KnowledgeSearch;
