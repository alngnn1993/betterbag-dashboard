import React, { useState } from 'react';

const DecisionCenter = () => {
  const [decisions, setDecisions] = useState([
    {
      id: 1,
      title: 'Pricing Optimization',
      query: 'Should we increase pricing by 10%?',
      recommendation: 'Test with bundle tier first',
      confidence: 85,
      risks: ['Customer churn increase', 'Competitive response'],
      alternatives: ['Value-add pricing', 'Segment-based tiers'],
      expectedOutcome: '15-20% revenue increase',
      timeline: '30 days',
      status: 'pending',
      createdAt: '2 hours ago',
      domain: 'pricing'
    },
    {
      id: 2,
      title: 'CAC Optimization',
      query: 'How can we reduce customer acquisition cost?',
      recommendation: 'Shift budget to high-ROAS channels',
      confidence: 78,
      risks: ['Reduced reach', 'Market saturation'],
      alternatives: ['Organic growth focus', 'Referral program'],
      expectedOutcome: '12-18% CAC reduction',
      timeline: '45 days',
      status: 'approved',
      createdAt: '5 hours ago',
      domain: 'marketing'
    },
    {
      id: 3,
      title: 'Churn Reduction',
      query: 'What\'s our best strategy to reduce churn?',
      recommendation: 'Launch win-back campaign for lapsed customers',
      confidence: 72,
      risks: ['Budget allocation', 'Message resonance'],
      alternatives: ['Loyalty program', 'Pricing discount'],
      expectedOutcome: '2-3% churn reduction',
      timeline: '60 days',
      status: 'pending',
      createdAt: '8 hours ago',
      domain: 'customer_success'
    },
    {
      id: 4,
      title: 'Product Expansion',
      query: 'Should we launch premium product tier?',
      recommendation: 'Develop premium features targeting enterprise',
      confidence: 68,
      risks: ['Development cost', 'Market demand uncertainty'],
      alternatives: ['Professional services', 'API licensing'],
      expectedOutcome: '30-40% revenue potential',
      timeline: '120 days',
      status: 'rejected',
      createdAt: '12 hours ago',
      domain: 'product'
    }
  ]);

  const [selectedDecision, setSelectedDecision] = useState(decisions[0]);
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredDecisions = decisions.filter(d => {
    const domainMatch = filterDomain === 'all' || d.domain === filterDomain;
    const statusMatch = filterStatus === 'all' || d.status === filterStatus;
    return domainMatch && statusMatch;
  });

  const handleApprove = (id) => {
    setDecisions(decisions.map(d =>
      d.id === id ? { ...d, status: 'approved' } : d
    ));
    setSelectedDecision(decisions.find(d => d.id === id) || decisions[0]);
  };

  const handleReject = (id) => {
    setDecisions(decisions.map(d =>
      d.id === id ? { ...d, status: 'rejected' } : d
    ));
    setSelectedDecision(decisions.find(d => d.id === id) || decisions[0]);
  };

  const getDomainColor = (domain) => {
    const colors = {
      pricing: '#ec4899',
      marketing: '#f59e0b',
      finance: '#3b82f6',
      customer_success: '#10b981',
      product: '#8b5cf6'
    };
    return colors[domain] || '#60a5fa';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      approved: '✅',
      rejected: '❌',
      'in-progress': '🔄'
    };
    return icons[status] || '•';
  };

  return (
    <div className="decision-center">
      <div className="background-gradient"></div>
      <div className="animated-grid"></div>

      <div className="decision-container">
        {/* Header */}
        <header className="decision-header">
          <h1>Decision Center</h1>
          <p>Analyze, approve, and track business recommendations</p>
        </header>

        <div className="decision-layout">
          {/* Left: Decision Queue */}
          <aside className="decision-queue">
            <div className="queue-header">
              <h2>Decision Queue</h2>
              <span className="queue-count">{filteredDecisions.length}</span>
            </div>

            {/* Filters */}
            <div className="filters">
              <div className="filter-group">
                <label>Domain</label>
                <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)}>
                  <option value="all">All Domains</option>
                  <option value="pricing">Pricing</option>
                  <option value="marketing">Marketing</option>
                  <option value="finance">Finance</option>
                  <option value="customer_success">Customer Success</option>
                  <option value="product">Product</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Queue List */}
            <div className="queue-list">
              {filteredDecisions.map((decision) => (
                <div
                  key={decision.id}
                  className={`queue-item ${selectedDecision?.id === decision.id ? 'active' : ''} status-${decision.status}`}
                  onClick={() => setSelectedDecision(decision)}
                >
                  <div className="queue-item-header">
                    <h3>{decision.title}</h3>
                    <span className="status-icon">{getStatusIcon(decision.status)}</span>
                  </div>

                  <div className="queue-meta">
                    <span
                      className="domain-tag"
                      style={{ background: getDomainColor(decision.domain) + '33' }}
                    >
                      {decision.domain}
                    </span>
                    <span className="time-ago">{decision.createdAt}</span>
                  </div>

                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{
                        width: `${decision.confidence}%`,
                        background: decision.confidence > 75
                          ? '#10b981'
                          : decision.confidence > 50
                          ? '#f59e0b'
                          : '#ef4444'
                      }}
                    ></div>
                  </div>
                  <span className="confidence-text">{decision.confidence}% confidence</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Right: Decision Detail */}
          <main className="decision-detail">
            {selectedDecision && (
              <>
                {/* Overview Card */}
                <section className="detail-card overview">
                  <div className="detail-header">
                    <div className="header-content">
                      <h2>{selectedDecision.title}</h2>
                      <p className="original-query">Original Query: "{selectedDecision.query}"</p>
                    </div>
                    <div className="header-stats">
                      <div className="stat">
                        <span className="stat-label">Confidence</span>
                        <span className="stat-value">{selectedDecision.confidence}%</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Domain</span>
                        <span className="stat-value" style={{ color: getDomainColor(selectedDecision.domain) }}>
                          {selectedDecision.domain}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Recommendation Card */}
                <section className="detail-card recommendation">
                  <h3>Recommendation</h3>
                  <div className="rec-content">
                    <div className="rec-main">
                      <h4>{selectedDecision.recommendation}</h4>
                    </div>

                    <div className="rec-grid">
                      <div className="rec-item">
                        <label>Expected Outcome</label>
                        <p>{selectedDecision.expectedOutcome}</p>
                      </div>
                      <div className="rec-item">
                        <label>Timeline</label>
                        <p>{selectedDecision.timeline}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Risks & Alternatives */}
                <div className="detail-row">
                  <section className="detail-card">
                    <h3>⚠️ Identified Risks</h3>
                    <ul className="risks-list">
                      {selectedDecision.risks.map((risk, i) => (
                        <li key={i}>{risk}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="detail-card">
                    <h3>💡 Alternatives</h3>
                    <ul className="alternatives-list">
                      {selectedDecision.alternatives.map((alt, i) => (
                        <li key={i}>{alt}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* Action Buttons */}
                {selectedDecision.status === 'pending' && (
                  <section className="action-card">
                    <div className="action-buttons">
                      <button
                        className="btn btn-approve"
                        onClick={() => handleApprove(selectedDecision.id)}
                      >
                        ✅ Approve Decision
                      </button>
                      <button
                        className="btn btn-review"
                        onClick={() => alert('Request more details from Finn...')}
                      >
                        🔍 Review More
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() => handleReject(selectedDecision.id)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </section>
                )}

                {selectedDecision.status === 'approved' && (
                  <section className="action-card approved-status">
                    <div className="status-content">
                      <span className="status-badge approved">✅ Approved</span>
                      <p>This recommendation has been approved and is being implemented.</p>
                    </div>
                  </section>
                )}

                {selectedDecision.status === 'rejected' && (
                  <section className="action-card rejected-status">
                    <div className="status-content">
                      <span className="status-badge rejected">❌ Rejected</span>
                      <p>This recommendation was rejected. Finn will learn from this feedback.</p>
                    </div>
                  </section>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .decision-center {
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

        .decision-container {
          position: relative;
          z-index: 10;
          max-width: 1600px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .decision-header {
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .decision-header h1 {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .decision-header p {
          color: #a5b4fc;
          font-size: 14px;
        }

        .decision-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 24px;
        }

        .decision-queue {
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.6) 0%, rgba(20, 28, 60, 0.4) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .queue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .queue-header h2 {
          font-size: 16px;
          font-weight: 700;
          color: #60a5fa;
          margin: 0;
        }

        .queue-count {
          font-size: 14px;
          font-weight: 700;
          background: rgba(59, 130, 246, 0.2);
          padding: 4px 10px;
          border-radius: 6px;
          color: #60a5fa;
        }

        .filters {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-group label {
          font-size: 10px;
          font-weight: 700;
          color: #a5b4fc;
          text-transform: uppercase;
        }

        .filter-group select {
          padding: 6px 8px;
          background: rgba(30, 41, 82, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 6px;
          color: #e0e6ff;
          font-size: 11px;
          font-family: inherit;
        }

        .queue-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 600px;
          overflow-y: auto;
        }

        .queue-item {
          padding: 12px;
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .queue-item:hover {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .queue-item.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .queue-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .queue-item h3 {
          font-size: 12px;
          font-weight: 700;
          color: #e0e6ff;
          margin: 0;
        }

        .status-icon {
          font-size: 16px;
        }

        .queue-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          align-items: center;
        }

        .domain-tag {
          font-size: 9px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .time-ago {
          font-size: 9px;
          color: #6b7280;
        }

        .confidence-bar {
          width: 100%;
          height: 4px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .confidence-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        .confidence-text {
          font-size: 10px;
          color: #a5b4fc;
          font-weight: 600;
        }

        .decision-detail {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .detail-card {
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.6) 0%, rgba(20, 28, 60, 0.4) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 24px;
          backdrop-filter: blur(10px);
        }

        .detail-card h3 {
          font-size: 16px;
          font-weight: 700;
          color: #60a5fa;
          margin: 0 0 16px 0;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .detail-header h2 {
          font-size: 22px;
          font-weight: 800;
          color: #e0e6ff;
          margin: 0 0 8px 0;
        }

        .original-query {
          font-size: 12px;
          color: #a5b4fc;
          margin: 0;
          font-style: italic;
        }

        .header-stats {
          display: flex;
          gap: 16px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-label {
          font-size: 10px;
          color: #a5b4fc;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 800;
          color: #60a5fa;
        }

        .rec-content {
          background: rgba(139, 92, 246, 0.05);
          padding: 16px;
          border-radius: 8px;
          border-left: 3px solid #8b5cf6;
        }

        .rec-main h4 {
          font-size: 15px;
          color: #e0e6ff;
          margin: 0 0 12px 0;
          line-height: 1.5;
        }

        .rec-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .rec-item {
          background: rgba(59, 130, 246, 0.1);
          padding: 10px;
          border-radius: 6px;
        }

        .rec-item label {
          font-size: 10px;
          color: #a5b4fc;
          text-transform: uppercase;
          font-weight: 600;
          display: block;
          margin-bottom: 4px;
        }

        .rec-item p {
          font-size: 12px;
          color: #e0e6ff;
          margin: 0;
        }

        .detail-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .risks-list,
        .alternatives-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .risks-list li,
        .alternatives-list li {
          padding: 10px;
          background: rgba(239, 68, 68, 0.05);
          border-left: 2px solid #ef4444;
          border-radius: 4px;
          font-size: 13px;
          color: #cbd5e1;
        }

        .alternatives-list li {
          background: rgba(34, 197, 94, 0.05);
          border-left-color: #10b981;
        }

        .action-card {
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.6) 0%, rgba(20, 28, 60, 0.4) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .btn {
          flex: 1;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-approve {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .btn-approve:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
        }

        .btn-review {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .btn-review:hover {
          background: rgba(59, 130, 246, 0.3);
        }

        .btn-reject {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .btn-reject:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .approved-status,
        .rejected-status {
          text-align: center;
        }

        .status-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .status-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
        }

        .status-badge.approved {
          background: rgba(34, 197, 94, 0.2);
          color: #10b981;
        }

        .status-badge.rejected {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .status-content p {
          color: #a5b4fc;
          font-size: 13px;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .decision-layout {
            grid-template-columns: 1fr;
          }

          .decision-queue {
            position: relative;
            top: auto;
          }

          .detail-row {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .rec-grid {
            grid-template-columns: 1fr;
          }

          .header-stats {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default DecisionCenter;
