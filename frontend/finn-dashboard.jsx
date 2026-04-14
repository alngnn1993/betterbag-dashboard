import React, { useState, useEffect } from 'react';

const FinnDashboard = () => {
  const [expertise, setExpertise] = useState({
    finance: 70,
    marketing: 60,
    operations: 55,
    strategy: 65,
    pricing: 68,
    growth: 62,
    customerSuccess: 58,
    product: 52
  });

  const [agents, setAgents] = useState([
    { id: 'finance', name: 'Finance Agent', expertise: 50, status: 'active', tasks: 12 },
    { id: 'marketing', name: 'Marketing Agent', expertise: 45, status: 'active', tasks: 8 },
    { id: 'operations', name: 'Operations Agent', expertise: 40, status: 'active', tasks: 15 },
    { id: 'success', name: 'Customer Success Agent', expertise: 45, status: 'active', tasks: 6 },
    { id: 'product', name: 'Product Agent', expertise: 40, status: 'idle', tasks: 3 }
  ]);

  const [metrics, setMetrics] = useState({
    mrr: 166667,
    activeSubscribers: 1050,
    cac: 25,
    ltv: 500,
    churnRate: 2.8,
    conversionRate: 3.2
  });

  const [decisions, setDecisions] = useState([
    {
      id: 1,
      title: 'Pricing Increase Test',
      recommendation: 'Test 10% increase with bundle tier',
      confidence: 85,
      status: 'pending'
    },
    {
      id: 2,
      title: 'CAC Optimization',
      recommendation: 'Shift budget to high-ROAS channels',
      confidence: 78,
      status: 'approved'
    },
    {
      id: 3,
      title: 'Retention Strategy',
      recommendation: 'Implement win-back campaign for lapsed customers',
      confidence: 72,
      status: 'pending'
    }
  ]);

  const overallExpertise = Math.round(
    Object.values(expertise).reduce((a, b) => a + b) / Object.keys(expertise).length
  );

  return (
    <div className="finn-dashboard">
      {/* Animated Background */}
      <div className="background-gradient"></div>
      <div className="animated-grid"></div>

      {/* Main Container */}
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="logo-section">
              <div className="finn-logo">⚡ FINN</div>
              <span className="tagline">AI CEO | BetterBag</span>
            </div>
            <div className="status-indicators">
              <div className="status-item">
                <span className="status-dot active"></span>
                <span>System Online</span>
              </div>
              <div className="status-item">
                <span className="status-dot">12</span>
                <span>Active Tasks</span>
              </div>
              <div className="status-item">
                <span className="expertise-score">{overallExpertise}%</span>
                <span>Overall Expertise</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="column left-column">
            {/* Expertise Radar */}
            <section className="card expertise-card">
              <h2>Domain Expertise</h2>
              <div className="expertise-grid">
                {Object.entries(expertise).map(([domain, level]) => (
                  <div key={domain} className="expertise-item">
                    <div className="domain-name">{domain}</div>
                    <div className="expertise-bar">
                      <div
                        className="expertise-fill"
                        style={{
                          width: `${level}%`,
                          '--fill-color': getExpertiseColor(level)
                        }}
                      ></div>
                    </div>
                    <div className="expertise-level">{level}%</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Metrics */}
            <section className="card metrics-card">
              <h2>Business Metrics</h2>
              <div className="metrics-grid">
                <div className="metric-box">
                  <div className="metric-label">Monthly Recurring Revenue</div>
                  <div className="metric-value">${(metrics.mrr / 1000).toFixed(0)}K</div>
                  <div className="metric-change">+8.5% from last month</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">Active Subscribers</div>
                  <div className="metric-value">{metrics.activeSubscribers}</div>
                  <div className="metric-change">Target: 1,111 by EOY</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">Customer Acquisition Cost</div>
                  <div className="metric-value">${metrics.cac}</div>
                  <div className="metric-change">Industry avg: $35</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">Lifetime Value</div>
                  <div className="metric-value">${metrics.ltv}</div>
                  <div className="metric-change">LTV/CAC: 20:1</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">Churn Rate</div>
                  <div className="metric-value">{metrics.churnRate}%</div>
                  <div className="metric-change">Target: <2%</div>
                </div>
                <div className="metric-box">
                  <div className="metric-label">Conversion Rate</div>
                  <div className="metric-value">{metrics.conversionRate}%</div>
                  <div className="metric-change">+0.4% from last week</div>
                </div>
              </div>
            </section>
          </div>

          {/* Middle Column */}
          <div className="column middle-column">
            {/* Sub-Agent Status */}
            <section className="card agents-card">
              <h2>Sub-Agents Status</h2>
              <div className="agents-list">
                {agents.map((agent) => (
                  <div key={agent.id} className="agent-item">
                    <div className="agent-header">
                      <div className="agent-info">
                        <span className="agent-name">{agent.name}</span>
                        <span className={`agent-status status-${agent.status}`}>
                          {agent.status}
                        </span>
                      </div>
                      <div className="agent-expertise">{agent.expertise}%</div>
                    </div>
                    <div className="agent-bar">
                      <div
                        className="agent-fill"
                        style={{ width: `${agent.expertise}%` }}
                      ></div>
                    </div>
                    <div className="agent-tasks">
                      <span className="task-count">{agent.tasks} active tasks</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Decisions Board */}
            <section className="card decisions-card">
              <h2>Pending Decisions</h2>
              <div className="decisions-list">
                {decisions.map((decision) => (
                  <div key={decision.id} className={`decision-item status-${decision.status}`}>
                    <div className="decision-header">
                      <h3>{decision.title}</h3>
                      <span className={`confidence-badge conf-${decision.confidence}`}>
                        {decision.confidence}% confidence
                      </span>
                    </div>
                    <p className="decision-text">{decision.recommendation}</p>
                    <div className="decision-actions">
                      {decision.status === 'pending' ? (
                        <>
                          <button className="btn-approve">Approve</button>
                          <button className="btn-review">Review More</button>
                        </>
                      ) : (
                        <span className="badge-status">Approved</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="column right-column">
            {/* Learning Growth */}
            <section className="card growth-card">
              <h2>Learning Trajectory</h2>
              <div className="growth-chart">
                <div className="chart-placeholder">
                  <div className="chart-line"></div>
                  <div className="chart-points">
                    <div className="point" style={{ left: '0%', bottom: '30%' }}></div>
                    <div className="point" style={{ left: '25%', bottom: '45%' }}></div>
                    <div className="point" style={{ left: '50%', bottom: '58%' }}></div>
                    <div className="point" style={{ left: '75%', bottom: '72%' }}></div>
                    <div className="point" style={{ left: '100%', bottom: '82%' }}></div>
                  </div>
                </div>
                <div className="chart-labels">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                  <span>Week 5</span>
                </div>
              </div>
              <div className="growth-stats">
                <div className="stat">
                  <span className="stat-label">Next Mastery</span>
                  <span className="stat-value">Finance (45 days)</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Learning Velocity</span>
                  <span className="stat-value">+2.1% per day</span>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="card actions-card">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                <button className="action-btn">
                  <span className="action-icon">🔍</span>
                  <span>Search Knowledge</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">💡</span>
                  <span>Get Recommendation</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">📊</span>
                  <span>View Reports</span>
                </button>
                <button className="action-btn">
                  <span className="action-icon">⚙️</span>
                  <span>Settings</span>
                </button>
              </div>
            </section>

            {/* Mastery Timeline */}
            <section className="card timeline-card">
              <h2>Path to Mastery</h2>
              <div className="timeline">
                <div className="timeline-item completed">
                  <span className="timeline-date">Today</span>
                  <span className="timeline-text">Foundation Complete (9,000 lines)</span>
                </div>
                <div className="timeline-item in-progress">
                  <span className="timeline-date">Apr 20</span>
                  <span className="timeline-text">Dashboard Live</span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-date">May 10</span>
                  <span className="timeline-text">Integration Complete</span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-date">May 20</span>
                  <span className="timeline-text">🚀 LAUNCH</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .finn-dashboard {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%);
          min-height: 100vh;
          color: #e0e6ff;
          overflow-x: hidden;
          position: relative;
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
          animation: drift 20s linear infinite;
        }

        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .dashboard-container {
          position: relative;
          z-index: 10;
          max-width: 1600px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .dashboard-header {
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .finn-logo {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tagline {
          font-size: 14px;
          color: #a5b4fc;
          font-weight: 500;
        }

        .status-indicators {
          display: flex;
          gap: 30px;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 6px;
          color: white;
        }

        .status-dot.active {
          background: #10b981;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .expertise-score {
          font-size: 16px;
          font-weight: 700;
          color: #60a5fa;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }

        .card {
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.6) 0%, rgba(20, 28, 60, 0.4) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 24px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .card:hover {
          border-color: rgba(59, 130, 246, 0.5);
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.8) 0%, rgba(20, 28, 60, 0.6) 100%);
          transform: translateY(-4px);
        }

        .card h2 {
          font-size: 18px;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }

        .column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .expertise-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .expertise-item {
          padding: 12px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.1);
        }

        .domain-name {
          font-size: 12px;
          color: #a5b4fc;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .expertise-bar {
          width: 100%;
          height: 6px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .expertise-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, var(--fill-color, #8b5cf6));
          transition: width 0.5s ease;
          border-radius: 3px;
        }

        .expertise-level {
          font-size: 13px;
          font-weight: 700;
          color: #60a5fa;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .metric-box {
          padding: 16px;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 8px;
          border-left: 3px solid #8b5cf6;
        }

        .metric-label {
          font-size: 12px;
          color: #a5b4fc;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .metric-value {
          font-size: 22px;
          font-weight: 800;
          color: #60a5fa;
          margin-bottom: 4px;
        }

        .metric-change {
          font-size: 11px;
          color: #818cf8;
        }

        .agents-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .agent-item {
          padding: 12px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.15);
        }

        .agent-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .agent-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .agent-name {
          font-size: 14px;
          font-weight: 600;
          color: #e0e6ff;
        }

        .agent-status {
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
          width: fit-content;
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .agent-status.status-idle {
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
        }

        .agent-expertise {
          font-size: 14px;
          font-weight: 700;
          color: #60a5fa;
        }

        .agent-bar {
          width: 100%;
          height: 4px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .agent-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          transition: width 0.5s ease;
        }

        .agent-tasks {
          font-size: 11px;
          color: #a5b4fc;
        }

        .decisions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .decision-item {
          padding: 16px;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 8px;
          border-left: 4px solid #8b5cf6;
          transition: all 0.3s ease;
        }

        .decision-item.status-approved {
          border-left-color: #22c55e;
          background: rgba(34, 197, 94, 0.05);
        }

        .decision-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 12px;
        }

        .decision-item h3 {
          font-size: 14px;
          font-weight: 700;
          color: #e0e6ff;
          margin: 0;
        }

        .confidence-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          white-space: nowrap;
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
        }

        .confidence-badge.conf-85 {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .decision-text {
          font-size: 13px;
          color: #cbd5e1;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .decision-actions {
          display: flex;
          gap: 8px;
        }

        .btn-approve,
        .btn-review {
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-transform: uppercase;
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

        .badge-status {
          font-size: 11px;
          font-weight: 700;
          color: #22c55e;
          text-transform: uppercase;
        }

        .growth-chart {
          height: 120px;
          margin-bottom: 16px;
          position: relative;
        }

        .chart-placeholder {
          width: 100%;
          height: 100px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
          position: relative;
          border: 1px solid rgba(59, 130, 246, 0.1);
        }

        .chart-line {
          position: absolute;
          bottom: 30%;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
          opacity: 0.3;
        }

        .chart-points {
          position: absolute;
          inset: 0;
        }

        .point {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #60a5fa;
          border-radius: 50%;
          border: 2px solid #1e293b;
          box-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
        }

        .chart-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 11px;
          color: #a5b4fc;
          font-weight: 600;
        }

        .growth-stats {
          display: flex;
          gap: 16px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 11px;
          color: #a5b4fc;
          text-transform: uppercase;
          font-weight: 600;
        }

        .stat-value {
          font-size: 13px;
          color: #60a5fa;
          font-weight: 700;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .action-btn {
          padding: 16px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          color: #e0e6ff;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }

        .action-icon {
          font-size: 20px;
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .timeline-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
          border-left: 3px solid rgba(59, 130, 246, 0.3);
          position: relative;
        }

        .timeline-item.completed {
          border-left-color: #22c55e;
          background: rgba(34, 197, 94, 0.05);
        }

        .timeline-item.in-progress {
          border-left-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }

        .timeline-date {
          font-size: 11px;
          font-weight: 700;
          color: #60a5fa;
          text-transform: uppercase;
          min-width: 60px;
        }

        .timeline-text {
          font-size: 13px;
          color: #cbd5e1;
        }

        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
          
          .header-content {
            flex-direction: column;
            gap: 16px;
          }
          
          .status-indicators {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

function getExpertiseColor(level) {
  if (level >= 80) return '#10b981';
  if (level >= 60) return '#60a5fa';
  if (level >= 40) return '#f59e0b';
  return '#ef4444';
}

export default FinnDashboard;
