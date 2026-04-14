import React, { useState } from 'react';

const ReportsAnalytics = () => {
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');

  const analyticsData = {
    overview: {
      mrr: 166667,
      mrrTrend: '+8.5%',
      subscribers: 1050,
      subscribersTrend: '+45',
      churn: 2.8,
      churnTrend: '-0.3%',
      cac: 25,
      cacTrend: '-2%',
      ltv: 500,
      ltvTrend: '+3%',
      roi: 20,
      roiTrend: '+1.2%'
    }
  };

  const decisionMetrics = [
    { title: 'Total Decisions', value: 34, trend: '+12' },
    { title: 'Approved', value: 24, trend: '+8' },
    { title: 'Rejected', value: 4, trend: '-1' },
    { title: 'Pending', value: 6, trend: '+5' },
    { title: 'Avg Confidence', value: '79%', trend: '+3%' },
    { title: 'Quality Score', value: '85%', trend: '+2%' }
  ];

  const topDecisions = [
    { title: 'Pricing Optimization', impact: 'High', status: 'Approved', confidence: 85 },
    { title: 'CAC Reduction', impact: 'High', status: 'Approved', confidence: 78 },
    { title: 'Churn Reduction', impact: 'Medium', status: 'Pending', confidence: 72 },
    { title: 'Feature Launch', impact: 'High', status: 'Rejected', confidence: 68 },
    { title: 'Partnership Strategy', impact: 'Medium', status: 'Approved', confidence: 75 }
  ];

  const agentPerformance = [
    { name: 'Finance Agent', expertise: 50, decisions: 12, quality: 87 },
    { name: 'Marketing Agent', expertise: 45, decisions: 8, quality: 82 },
    { name: 'Operations Agent', expertise: 40, decisions: 15, quality: 78 },
    { name: 'Customer Success Agent', expertise: 45, decisions: 6, quality: 85 },
    { name: 'Product Agent', expertise: 40, decisions: 3, quality: 76 }
  ];

  return (
    <div className="reports-analytics">
      <div className="background-gradient"></div>
      <div className="animated-grid"></div>

      <div className="analytics-container">
        {/* Header */}
        <header className="analytics-header">
          <h1>Reports & Analytics</h1>
          <p>Comprehensive insights into business performance and decision quality</p>
        </header>

        {/* Report Type Selector */}
        <section className="report-selector">
          <div className="selector-buttons">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'decisions', label: '🎯 Decisions' },
              { id: 'agents', label: '👥 Agents' },
              { id: 'trends', label: '📈 Trends' }
            ].map(btn => (
              <button
                key={btn.id}
                className={`selector-btn ${reportType === btn.id ? 'active' : ''}`}
                onClick={() => setReportType(btn.id)}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="date-range">
            <label>Date Range:</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </section>

        {/* Overview Report */}
        {reportType === 'overview' && (
          <>
            {/* Key Metrics Grid */}
            <section className="metrics-grid">
              {[
                { label: 'Monthly Recurring Revenue', value: `$${(analyticsData.overview.mrr / 1000).toFixed(0)}K`, trend: analyticsData.overview.mrrTrend, icon: '💰' },
                { label: 'Active Subscribers', value: analyticsData.overview.subscribers, trend: analyticsData.overview.subscribersTrend, icon: '👥' },
                { label: 'Churn Rate', value: `${analyticsData.overview.churn}%`, trend: analyticsData.overview.churnTrend, icon: '📉' },
                { label: 'Customer Acquisition Cost', value: `$${analyticsData.overview.cac}`, trend: analyticsData.overview.cacTrend, icon: '🎯' },
                { label: 'Customer Lifetime Value', value: `$${analyticsData.overview.ltv}`, trend: analyticsData.overview.ltvTrend, icon: '📊' },
                { label: 'Return on Investment', value: `${analyticsData.overview.roi}x`, trend: analyticsData.overview.roiTrend, icon: '📈' }
              ].map((metric, i) => (
                <div key={i} className="metric-card">
                  <div className="metric-header">
                    <span className="metric-icon">{metric.icon}</span>
                    <span className="metric-label">{metric.label}</span>
                  </div>
                  <div className="metric-value">{metric.value}</div>
                  <span className={`metric-trend ${metric.trend.includes('-') ? 'negative' : 'positive'}`}>
                    {metric.trend}
                  </span>
                </div>
              ))}
            </section>

            {/* Financial Summary */}
            <section className="analytics-card">
              <h3>Financial Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <label>Total Revenue (YTD)</label>
                  <div className="summary-value">$500,000</div>
                  <span className="summary-detail">Target: $2,000,000</span>
                </div>
                <div className="summary-item">
                  <label>Total Costs (YTD)</label>
                  <div className="summary-value">$125,000</div>
                  <span className="summary-detail">Ad spend + operations</span>
                </div>
                <div className="summary-item">
                  <label>Net Profit (YTD)</label>
                  <div className="summary-value">$375,000</div>
                  <span className="summary-detail">75% margin</span>
                </div>
                <div className="summary-item">
                  <label>Gross Margin</label>
                  <div className="summary-value">92%</div>
                  <span className="summary-detail">Product delivery cost</span>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Decisions Report */}
        {reportType === 'decisions' && (
          <>
            {/* Decision Metrics */}
            <section className="metrics-grid">
              {decisionMetrics.map((metric, i) => (
                <div key={i} className="metric-card">
                  <div className="metric-label">{metric.title}</div>
                  <div className="metric-value">{metric.value}</div>
                  <span className="metric-trend positive">{metric.trend}</span>
                </div>
              ))}
            </section>

            {/* Top Decisions */}
            <section className="analytics-card">
              <h3>Top Decisions by Impact</h3>
              <div className="decisions-table">
                <div className="table-header">
                  <div className="col-title">Decision</div>
                  <div className="col-impact">Impact</div>
                  <div className="col-status">Status</div>
                  <div className="col-confidence">Confidence</div>
                </div>
                {topDecisions.map((decision, i) => (
                  <div key={i} className="table-row">
                    <div className="col-title">{decision.title}</div>
                    <div className="col-impact">
                      <span className={`impact-badge ${decision.impact.toLowerCase()}`}>
                        {decision.impact}
                      </span>
                    </div>
                    <div className="col-status">
                      <span className={`status-badge ${decision.status.toLowerCase()}`}>
                        {decision.status}
                      </span>
                    </div>
                    <div className="col-confidence">
                      <div className="confidence-bar">
                        <div
                          className="confidence-fill"
                          style={{ width: `${decision.confidence}%` }}
                        ></div>
                      </div>
                      <span>{decision.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Agent Performance Report */}
        {reportType === 'agents' && (
          <>
            <section className="analytics-card">
              <h3>Sub-Agent Performance</h3>
              <div className="agent-performance">
                {agentPerformance.map((agent, i) => (
                  <div key={i} className="agent-row">
                    <div className="agent-info">
                      <h4>{agent.name}</h4>
                      <div className="agent-stats">
                        <span className="stat">
                          <strong>Expertise:</strong> {agent.expertise}%
                        </span>
                        <span className="stat">
                          <strong>Decisions:</strong> {agent.decisions}
                        </span>
                      </div>
                    </div>

                    <div className="agent-metrics">
                      <div className="metric-box">
                        <label>Expertise Level</label>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${agent.expertise}%`,
                              background: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                            }}
                          ></div>
                        </div>
                        <span>{agent.expertise}%</span>
                      </div>

                      <div className="metric-box">
                        <label>Quality Score</label>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${agent.quality}%`,
                              background: 'linear-gradient(90deg, #10b981, #34d399)'
                            }}
                          ></div>
                        </div>
                        <span>{agent.quality}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Agent Comparison */}
            <section className="analytics-card">
              <h3>Comparative Analysis</h3>
              <div className="comparison-table">
                <div className="table-header">
                  <div className="col-name">Agent</div>
                  <div className="col-expertise">Expertise</div>
                  <div className="col-decisions">Decisions</div>
                  <div className="col-quality">Quality</div>
                  <div className="col-trend">Trend</div>
                </div>
                {agentPerformance.map((agent, i) => (
                  <div key={i} className="table-row">
                    <div className="col-name">{agent.name}</div>
                    <div className="col-expertise">{agent.expertise}%</div>
                    <div className="col-decisions">{agent.decisions}</div>
                    <div className="col-quality">{agent.quality}%</div>
                    <div className="col-trend">
                      <span className="trend-badge up">↑ +5%</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Trends Report */}
        {reportType === 'trends' && (
          <>
            <section className="analytics-card large">
              <h3>Growth Trends</h3>
              <div className="trends-container">
                <div className="trend-item">
                  <h4>Subscriber Growth</h4>
                  <div className="trend-chart">
                    <div className="trend-line">
                      {[900, 920, 950, 980, 1000, 1025, 1050].map((val, i) => (
                        <div
                          key={i}
                          className="trend-point"
                          style={{
                            left: `${(i / 6) * 100}%`,
                            height: `${(val / 1050) * 100}%`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <p className="trend-summary">+150 subscribers in 30 days (+16.7%)</p>
                </div>

                <div className="trend-item">
                  <h4>Decision Quality</h4>
                  <div className="trend-chart">
                    <div className="trend-line">
                      {[72, 74, 76, 78, 79, 80, 82].map((val, i) => (
                        <div
                          key={i}
                          className="trend-point"
                          style={{
                            left: `${(i / 6) * 100}%`,
                            height: `${(val / 100) * 100}%`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <p className="trend-summary">Decision quality improving +10% over 30 days</p>
                </div>

                <div className="trend-item">
                  <h4>Expertise Growth</h4>
                  <div className="trend-chart">
                    <div className="trend-line">
                      {[45, 50, 55, 58, 60, 62, 65].map((val, i) => (
                        <div
                          key={i}
                          className="trend-point"
                          style={{
                            left: `${(i / 6) * 100}%`,
                            height: `${(val / 100) * 100}%`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <p className="trend-summary">Overall expertise up +20% since launch</p>
                </div>
              </div>
            </section>

            {/* Insights */}
            <section className="analytics-card">
              <h3>📊 Key Insights</h3>
              <div className="insights-list">
                <div className="insight">
                  <span className="insight-icon">✓</span>
                  <div>
                    <h4>Positive Momentum</h4>
                    <p>All key metrics showing positive growth trends. Subscriber acquisition exceeding targets.</p>
                  </div>
                </div>
                <div className="insight">
                  <span className="insight-icon">✓</span>
                  <div>
                    <h4>High Decision Quality</h4>
                    <p>Average recommendation confidence at 79% with improving quality score week-over-week.</p>
                  </div>
                </div>
                <div className="insight">
                  <span className="insight-icon">⚠</span>
                  <div>
                    <h4>Churn Monitoring</h4>
                    <p>Current churn at 2.8% - slightly above target of 2%. Recommend focus on retention.</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      <style>{`
        .reports-analytics {
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

        .analytics-container {
          position: relative;
          z-index: 10;
          max-width: 1600px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .analytics-header {
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .analytics-header h1 {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .analytics-header p {
          color: #a5b4fc;
          font-size: 14px;
          margin: 0;
        }

        .report-selector {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          padding: 16px;
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.6) 0%, rgba(20, 28, 60, 0.4) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .selector-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .selector-btn {
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

        .selector-btn:hover {
          background: rgba(59, 130, 246, 0.2);
        }

        .selector-btn.active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border-color: rgba(59, 130, 246, 0.5);
        }

        .date-range {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .date-range label {
          font-size: 12px;
          color: #a5b4fc;
          font-weight: 600;
        }

        .date-range select {
          padding: 6px 10px;
          background: rgba(15, 23, 41, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 6px;
          color: #e0e6ff;
          font-size: 12px;
          cursor: pointer;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }

        .metric-card {
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.6) 0%, rgba(20, 28, 60, 0.4) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .metric-icon {
          font-size: 20px;
        }

        .metric-label {
          font-size: 12px;
          color: #a5b4fc;
          font-weight: 600;
          text-transform: uppercase;
        }

        .metric-value {
          font-size: 28px;
          font-weight: 800;
          color: #60a5fa;
          margin-bottom: 8px;
        }

        .metric-trend {
          display: block;
          font-size: 12px;
          font-weight: 700;
        }

        .metric-trend.positive {
          color: #10b981;
        }

        .metric-trend.negative {
          color: #ef4444;
        }

        .analytics-card {
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.6) 0%, rgba(20, 28, 60, 0.4) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 24px;
          backdrop-filter: blur(10px);
          margin-bottom: 24px;
        }

        .analytics-card h3 {
          font-size: 18px;
          font-weight: 700;
          color: #60a5fa;
          margin: 0 0 20px 0;
        }

        .analytics-card.large {
          grid-column: 1 / -1;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .summary-item {
          padding: 16px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.1);
          border-radius: 8px;
        }

        .summary-item label {
          display: block;
          font-size: 11px;
          color: #a5b4fc;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .summary-value {
          font-size: 24px;
          font-weight: 800;
          color: #60a5fa;
          margin-bottom: 4px;
        }

        .summary-detail {
          display: block;
          font-size: 11px;
          color: #6b7280;
        }

        .decisions-table,
        .comparison-table {
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 12px;
          padding: 12px;
          background: rgba(59, 130, 246, 0.1);
          font-weight: 700;
          font-size: 12px;
          color: #60a5fa;
          text-transform: uppercase;
        }

        .comparison-table .table-header {
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 12px;
          padding: 12px;
          border-top: 1px solid rgba(59, 130, 246, 0.1);
          align-items: center;
          font-size: 13px;
        }

        .comparison-table .table-row {
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
        }

        .col-title {
          color: #e0e6ff;
          font-weight: 600;
        }

        .col-impact,
        .col-status,
        .col-confidence {
          text-align: center;
        }

        .impact-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .impact-badge.high {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .impact-badge.medium {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
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

        .status-badge.pending {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .confidence-bar {
          width: 100px;
          height: 4px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          transition: width 0.5s ease;
        }

        .agent-performance {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .agent-row {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 20px;
          padding: 16px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.1);
          border-radius: 8px;
        }

        .agent-info h4 {
          font-size: 14px;
          font-weight: 700;
          color: #e0e6ff;
          margin: 0 0 8px 0;
        }

        .agent-stats {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .agent-stats .stat {
          font-size: 12px;
          color: #a5b4fc;
        }

        .agent-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .metric-box {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .metric-box label {
          font-size: 11px;
          color: #a5b4fc;
          font-weight: 600;
          text-transform: uppercase;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.5s ease;
          border-radius: 3px;
        }

        .metric-box span {
          font-size: 12px;
          color: #60a5fa;
          font-weight: 700;
        }

        .trends-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .trend-item {
          padding: 16px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.1);
          border-radius: 8px;
        }

        .trend-item h4 {
          font-size: 14px;
          font-weight: 700;
          color: #e0e6ff;
          margin: 0 0 12px 0;
        }

        .trend-chart {
          width: 100%;
          height: 80px;
          margin-bottom: 12px;
          position: relative;
        }

        .trend-line {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          gap: 2px;
        }

        .trend-point {
          flex: 1;
          background: linear-gradient(180deg, #3b82f6, #60a5fa);
          border-radius: 2px;
          min-height: 5px;
        }

        .trend-summary {
          font-size: 12px;
          color: #a5b4fc;
          margin: 0;
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .insight {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
        }

        .insight-icon {
          font-size: 18px;
          min-width: 24px;
        }

        .insight h4 {
          font-size: 13px;
          font-weight: 700;
          color: #e0e6ff;
          margin: 0 0 4px 0;
        }

        .insight p {
          font-size: 12px;
          color: #a5b4fc;
          margin: 0;
        }

        .col-name {
          color: #e0e6ff;
          font-weight: 600;
        }

        .col-expertise,
        .col-decisions,
        .col-quality,
        .col-trend {
          text-align: center;
          color: #a5b4fc;
        }

        .trend-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          background: rgba(34, 197, 94, 0.2);
          color: #10b981;
        }

        @media (max-width: 1024px) {
          .agent-row {
            grid-template-columns: 1fr;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportsAnalytics;
