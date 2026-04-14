import React, { useState } from 'react';

const ExpertiseReports = () => {
  const [selectedDomain, setSelectedDomain] = useState('finance');
  const [timeRange, setTimeRange] = useState('30days');

  const expertiseData = {
    finance: {
      current: 70,
      previous: 62,
      trend: 'up',
      daysToMastery: 45,
      conceptsLearned: 23,
      decisionsObserved: 18,
      qualityScore: 87,
      learning: [
        { week: 'Week 1', level: 62, concepts: 8 },
        { week: 'Week 2', level: 66, concepts: 11 },
        { week: 'Week 3', level: 70, concepts: 4 }
      ]
    },
    marketing: {
      current: 60,
      previous: 52,
      trend: 'up',
      daysToMastery: 75,
      conceptsLearned: 18,
      decisionsObserved: 12,
      qualityScore: 78,
      learning: [
        { week: 'Week 1', level: 52, concepts: 6 },
        { week: 'Week 2', level: 56, concepts: 8 },
        { week: 'Week 3', level: 60, concepts: 4 }
      ]
    },
    operations: {
      current: 55,
      previous: 48,
      trend: 'up',
      daysToMastery: 120,
      conceptsLearned: 15,
      decisionsObserved: 10,
      qualityScore: 72,
      learning: [
        { week: 'Week 1', level: 48, concepts: 5 },
        { week: 'Week 2', level: 51, concepts: 6 },
        { week: 'Week 3', level: 55, concepts: 4 }
      ]
    },
    strategy: {
      current: 65,
      previous: 58,
      trend: 'up',
      daysToMastery: 60,
      conceptsLearned: 21,
      decisionsObserved: 15,
      qualityScore: 83,
      learning: [
        { week: 'Week 1', level: 58, concepts: 7 },
        { week: 'Week 2', level: 62, concepts: 9 },
        { week: 'Week 3', level: 65, concepts: 5 }
      ]
    }
  };

  const domains = ['finance', 'marketing', 'operations', 'strategy', 'pricing', 'customer_success'];
  const data = expertiseData[selectedDomain];

  return (
    <div className="expertise-reports">
      <div className="background-gradient"></div>
      <div className="animated-grid"></div>

      <div className="reports-container">
        {/* Header */}
        <header className="reports-header">
          <h1>Expertise Reports</h1>
          <p>Detailed analysis of learning progress and mastery timelines</p>
        </header>

        {/* Domain Selection */}
        <section className="domain-selector">
          <h2>Select Domain</h2>
          <div className="domain-buttons">
            {domains.map(domain => (
              <button
                key={domain}
                className={`domain-btn ${selectedDomain === domain ? 'active' : ''}`}
                onClick={() => setSelectedDomain(domain)}
              >
                {domain.charAt(0).toUpperCase() + domain.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* Main Report */}
        <div className="report-grid">
          {/* Left: Overview */}
          <aside className="report-sidebar">
            {/* Key Metrics */}
            <section className="report-card">
              <h3>Key Metrics</h3>
              <div className="metrics-stack">
                <div className="metric-item">
                  <label>Current Expertise</label>
                  <div className="metric-value">{data.current}%</div>
                  <span className="trend up">↑ +{data.current - data.previous}% from Week 1</span>
                </div>

                <div className="metric-item">
                  <label>Quality Score</label>
                  <div className="metric-value">{data.qualityScore}%</div>
                  <span className="quality">High consistency</span>
                </div>

                <div className="metric-item">
                  <label>Days to Mastery</label>
                  <div className="metric-value">{data.daysToMastery}</div>
                  <span className="timeline">Estimated timeline</span>
                </div>
              </div>
            </section>

            {/* Learning Stats */}
            <section className="report-card">
              <h3>Learning Stats</h3>
              <div className="stats-grid">
                <div className="stat">
                  <span className="stat-icon">📚</span>
                  <span className="stat-label">Concepts</span>
                  <span className="stat-count">{data.conceptsLearned}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">🎯</span>
                  <span className="stat-label">Decisions</span>
                  <span className="stat-count">{data.decisionsObserved}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">⚡</span>
                  <span className="stat-label">Velocity</span>
                  <span className="stat-count">+2.1%</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">✅</span>
                  <span className="stat-label">Accuracy</span>
                  <span className="stat-count">87%</span>
                </div>
              </div>
            </section>

            {/* Progress to Milestones */}
            <section className="report-card">
              <h3>Milestone Progress</h3>
              <div className="milestones">
                <div className="milestone completed">
                  <span className="milestone-icon">✓</span>
                  <span className="milestone-text">50% Proficiency</span>
                  <span className="milestone-date">Week 1</span>
                </div>
                <div className="milestone completed">
                  <span className="milestone-icon">✓</span>
                  <span className="milestone-text">60% Proficiency</span>
                  <span className="milestone-date">Week 2</span>
                </div>
                <div className="milestone in-progress">
                  <span className="milestone-icon">→</span>
                  <span className="milestone-text">70% Proficiency</span>
                  <span className="milestone-date">This Week</span>
                </div>
                <div className="milestone upcoming">
                  <span className="milestone-icon">◯</span>
                  <span className="milestone-text">90% Mastery</span>
                  <span className="milestone-date">45 days</span>
                </div>
              </div>
            </section>
          </aside>

          {/* Right: Detailed Analysis */}
          <main className="report-main">
            {/* Expertise Trajectory Chart */}
            <section className="report-card large">
              <h3>Learning Trajectory</h3>
              <div className="chart-container">
                <div className="chart">
                  <div className="y-axis">
                    <span>100%</span>
                    <span>80%</span>
                    <span>60%</span>
                    <span>40%</span>
                    <span>20%</span>
                    <span>0%</span>
                  </div>
                  <div className="chart-area">
                    <div className="chart-line">
                      {data.learning.map((point, i) => (
                        <div
                          key={i}
                          className="chart-point"
                          style={{
                            left: `${(i / (data.learning.length - 1)) * 100}%`,
                            bottom: `${point.level}%`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="chart-legend">
                  {data.learning.map((point, i) => (
                    <div key={i} className="legend-item">
                      <span className="legend-label">{point.week}</span>
                      <span className="legend-value">{point.level}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Concept Distribution */}
            <section className="report-card large">
              <h3>Concept Distribution</h3>
              <div className="concept-bars">
                {[
                  { category: 'Critical Concepts', count: 8, color: '#ef4444' },
                  { category: 'High Priority', count: 10, color: '#f59e0b' },
                  { category: 'Medium Priority', count: 4, color: '#3b82f6' },
                  { category: 'Low Priority', count: 1, color: '#6b7280' }
                ].map((item, i) => (
                  <div key={i} className="concept-bar">
                    <div className="bar-label">
                      <span>{item.category}</span>
                      <span className="count">{item.count}</span>
                    </div>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${(item.count / 23) * 100}%`,
                          background: item.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Strengths & Gaps */}
            <div className="analysis-grid">
              <section className="report-card">
                <h3>💪 Key Strengths</h3>
                <ul className="list-items">
                  <li>Strong understanding of unit economics</li>
                  <li>Excellent CAC/LTV analysis capability</li>
                  <li>Consistent decision-making patterns</li>
                  <li>Rapid concept absorption</li>
                </ul>
              </section>

              <section className="report-card">
                <h3>🎯 Areas to Develop</h3>
                <ul className="list-items">
                  <li>Advanced pricing strategy models</li>
                  <li>Market scenario planning</li>
                  <li>Competitive intelligence analysis</li>
                  <li>Long-term forecasting techniques</li>
                </ul>
              </section>
            </div>

            {/* Recommendations */}
            <section className="report-card large">
              <h3>📋 Personalized Recommendations</h3>
              <div className="recommendations">
                <div className="rec-item">
                  <span className="rec-icon">1</span>
                  <div>
                    <h4>Deep Dive into Advanced Pricing</h4>
                    <p>You've mastered basics. Next: Dynamic pricing models and A/B testing frameworks</p>
                  </div>
                </div>
                <div className="rec-item">
                  <span className="rec-icon">2</span>
                  <div>
                    <h4>Expand Strategic Analysis</h4>
                    <p>Build expertise in competitive positioning and market timing strategies</p>
                  </div>
                </div>
                <div className="rec-item">
                  <span className="rec-icon">3</span>
                  <div>
                    <h4>Practice Integration</h4>
                    <p>Apply finance knowledge to real business scenarios and decisions</p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <style>{`
        .expertise-reports {
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

        .reports-container {
          position: relative;
          z-index: 10;
          max-width: 1600px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .reports-header {
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .reports-header h1 {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .reports-header p {
          color: #a5b4fc;
          font-size: 14px;
          margin: 0;
        }

        .domain-selector {
          margin-bottom: 40px;
          padding: 20px;
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.6) 0%, rgba(20, 28, 60, 0.4) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
        }

        .domain-selector h2 {
          font-size: 14px;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: #60a5fa;
        }

        .domain-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .domain-btn {
          padding: 8px 14px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 6px;
          color: #a5b4fc;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .domain-btn:hover {
          background: rgba(59, 130, 246, 0.2);
        }

        .domain-btn.active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border-color: rgba(59, 130, 246, 0.5);
        }

        .report-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 24px;
        }

        .report-card {
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.6) 0%, rgba(20, 28, 60, 0.4) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .report-card h3 {
          font-size: 14px;
          font-weight: 700;
          color: #60a5fa;
          margin: 0 0 16px 0;
        }

        .metrics-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .metric-item {
          padding: 12px;
          background: rgba(139, 92, 246, 0.05);
          border-radius: 8px;
        }

        .metric-item label {
          display: block;
          font-size: 10px;
          color: #a5b4fc;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .metric-value {
          font-size: 24px;
          font-weight: 800;
          color: #60a5fa;
          margin-bottom: 4px;
        }

        .trend {
          display: block;
          font-size: 11px;
          color: #10b981;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          text-align: center;
        }

        .stat-icon {
          font-size: 20px;
          margin-bottom: 4px;
        }

        .stat-label {
          display: block;
          font-size: 10px;
          color: #a5b4fc;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .stat-count {
          font-size: 14px;
          font-weight: 700;
          color: #60a5fa;
        }

        .milestones {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .milestone {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 6px;
        }

        .milestone-icon {
          font-size: 18px;
          min-width: 24px;
          text-align: center;
        }

        .milestone.completed .milestone-icon {
          color: #10b981;
        }

        .milestone.in-progress .milestone-icon {
          color: #f59e0b;
        }

        .milestone.upcoming .milestone-icon {
          color: #6b7280;
        }

        .milestone-text {
          font-size: 12px;
          color: #e0e6ff;
          font-weight: 600;
          flex: 1;
        }

        .milestone-date {
          font-size: 10px;
          color: #a5b4fc;
        }

        .report-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .report-card.large {
          grid-column: 1 / -1;
        }

        .chart-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chart {
          display: flex;
          gap: 16px;
          height: 150px;
          position: relative;
        }

        .y-axis {
          display: flex;
          flex-direction: column-reverse;
          justify-content: space-between;
          font-size: 10px;
          color: #6b7280;
          width: 40px;
          text-align: right;
        }

        .chart-area {
          flex: 1;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
          position: relative;
          border-left: 2px solid rgba(59, 130, 246, 0.2);
          border-bottom: 2px solid rgba(59, 130, 246, 0.2);
        }

        .chart-line {
          position: absolute;
          inset: 0;
        }

        .chart-point {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #60a5fa;
          border: 2px solid #0f1729;
          border-radius: 50%;
          transform: translate(-50%, 50%);
          box-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
        }

        .chart-legend {
          display: flex;
          justify-content: space-around;
          gap: 8px;
        }

        .legend-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex: 1;
        }

        .legend-label {
          font-size: 11px;
          color: #a5b4fc;
          font-weight: 600;
        }

        .legend-value {
          font-size: 12px;
          color: #60a5fa;
          font-weight: 700;
        }

        .concept-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .concept-bar {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .bar-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
        }

        .count {
          color: #60a5fa;
        }

        .bar-container {
          width: 100%;
          height: 6px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          transition: width 0.5s ease;
          border-radius: 3px;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .list-items {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .list-items li {
          padding: 10px;
          background: rgba(139, 92, 246, 0.05);
          border-left: 2px solid #8b5cf6;
          border-radius: 4px;
          font-size: 13px;
          color: #cbd5e1;
        }

        .recommendations {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rec-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
        }

        .rec-icon {
          font-size: 20px;
          font-weight: 800;
          color: #3b82f6;
          min-width: 28px;
          text-align: center;
        }

        .rec-item h4 {
          font-size: 13px;
          font-weight: 700;
          color: #e0e6ff;
          margin: 0 0 4px 0;
        }

        .rec-item p {
          font-size: 12px;
          color: #a5b4fc;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .report-grid {
            grid-template-columns: 1fr;
          }

          .analysis-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .domain-buttons {
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .chart {
            height: 120px;
          }
        }
      `}</style>
    </div>
  );
};

export default ExpertiseReports;
