import React, { useState } from 'react';

const AgentManagement = () => {
  const [agents, setAgents] = useState([
    {
      id: 'finance',
      name: 'Finance Agent',
      role: 'Finance Operations',
      expertise: 50,
      tasks: [
        { id: 1, title: 'Q2 Cash Flow Forecast', status: 'in-progress', priority: 'high' },
        { id: 2, title: 'Monthly P&L Report', status: 'completed', priority: 'normal' },
        { id: 3, title: 'Budget Analysis', status: 'pending', priority: 'high' }
      ],
      performance: 87,
      assignedTasks: 12,
      completedTasks: 9
    },
    {
      id: 'marketing',
      name: 'Marketing Agent',
      role: 'Customer Acquisition',
      expertise: 45,
      tasks: [
        { id: 4, title: 'CAC Optimization Analysis', status: 'in-progress', priority: 'critical' },
        { id: 5, title: 'Channel Performance Report', status: 'completed', priority: 'normal' },
        { id: 6, title: 'ROAS Tracking Dashboard', status: 'in-progress', priority: 'high' }
      ],
      performance: 82,
      assignedTasks: 8,
      completedTasks: 6
    },
    {
      id: 'operations',
      name: 'Operations Agent',
      role: 'Process Management',
      expertise: 40,
      tasks: [
        { id: 7, title: 'Fulfillment Optimization', status: 'in-progress', priority: 'high' },
        { id: 8, title: 'Inventory Audit', status: 'pending', priority: 'normal' },
        { id: 9, title: 'Quality Assurance Review', status: 'pending', priority: 'normal' }
      ],
      performance: 78,
      assignedTasks: 15,
      completedTasks: 11
    },
    {
      id: 'success',
      name: 'Customer Success Agent',
      role: 'Retention & Growth',
      expertise: 45,
      tasks: [
        { id: 10, title: 'Churn Prediction Model', status: 'pending', priority: 'critical' },
        { id: 11, title: 'Win-back Campaign', status: 'in-progress', priority: 'high' },
        { id: 12, title: 'NPS Analysis', status: 'completed', priority: 'normal' }
      ],
      performance: 85,
      assignedTasks: 6,
      completedTasks: 4
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'normal' });

  const handleAssignTask = () => {
    if (newTask.title.trim()) {
      const updatedAgents = agents.map(agent => {
        if (agent.id === selectedAgent.id) {
          return {
            ...agent,
            tasks: [
              ...agent.tasks,
              {
                id: Math.max(...agent.tasks.map(t => t.id), 0) + 1,
                title: newTask.title,
                status: 'pending',
                priority: newTask.priority
              }
            ],
            assignedTasks: agent.assignedTasks + 1
          };
        }
        return agent;
      });
      setAgents(updatedAgents);
      setSelectedAgent(updatedAgents.find(a => a.id === selectedAgent.id));
      setNewTask({ title: '', priority: 'normal' });
      setShowTaskForm(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: '#ef4444',
      high: '#f59e0b',
      normal: '#60a5fa',
      low: '#6b7280'
    };
    return colors[priority] || colors.normal;
  };

  const getStatusColor = (status) => {
    const colors = {
      'in-progress': '#3b82f6',
      'completed': '#10b981',
      'pending': '#f59e0b'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="agent-management">
      <div className="background-gradient"></div>
      <div className="animated-grid"></div>

      <div className="management-container">
        {/* Header */}
        <header className="management-header">
          <h1>Sub-Agent Command Center</h1>
          <p>Monitor and manage specialized AI agents across all business functions</p>
        </header>

        <div className="management-grid">
          {/* Left: Agent List */}
          <aside className="agents-sidebar">
            <h2>Active Agents</h2>
            <div className="agents-scroll">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`agent-card ${selectedAgent?.id === agent.id ? 'active' : ''}`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="agent-card-header">
                    <div className="agent-avatar">{agent.name.charAt(0)}</div>
                    <div className="agent-card-info">
                      <h3>{agent.name}</h3>
                      <p>{agent.role}</p>
                    </div>
                  </div>
                  <div className="agent-card-stats">
                    <div className="stat-badge">
                      <span className="stat-label">Expertise</span>
                      <span className="stat-value">{agent.expertise}%</span>
                    </div>
                    <div className="stat-badge">
                      <span className="stat-label">Tasks</span>
                      <span className="stat-value">{agent.assignedTasks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Right: Agent Details */}
          <main className="agent-details">
            {selectedAgent && (
              <>
                {/* Agent Overview */}
                <section className="detail-card overview-card">
                  <div className="card-header">
                    <div className="agent-title">
                      <h2>{selectedAgent.name}</h2>
                      <span className="agent-role">{selectedAgent.role}</span>
                    </div>
                    <div className="agent-score">{selectedAgent.performance}%</div>
                  </div>

                  <div className="metrics-row">
                    <div className="metric">
                      <label>Current Expertise</label>
                      <div className="metric-bar">
                        <div
                          className="metric-fill"
                          style={{
                            width: `${selectedAgent.expertise}%`,
                            background: `linear-gradient(90deg, #3b82f6, ${
                              selectedAgent.expertise > 70 ? '#10b981' : '#8b5cf6'
                            })`
                          }}
                        ></div>
                      </div>
                      <span className="metric-text">{selectedAgent.expertise}% proficiency</span>
                    </div>

                    <div className="metric">
                      <label>Performance Score</label>
                      <div className="metric-bar">
                        <div
                          className="metric-fill"
                          style={{
                            width: `${selectedAgent.performance}%`,
                            background: 'linear-gradient(90deg, #8b5cf6, #ec4899)'
                          }}
                        ></div>
                      </div>
                      <span className="metric-text">{selectedAgent.performance}% efficiency</span>
                    </div>

                    <div className="metric">
                      <label>Task Completion</label>
                      <div className="metric-bar">
                        <div
                          className="metric-fill"
                          style={{
                            width: `${(selectedAgent.completedTasks / selectedAgent.assignedTasks) * 100}%`,
                            background: 'linear-gradient(90deg, #10b981, #34d399)'
                          }}
                        ></div>
                      </div>
                      <span className="metric-text">
                        {selectedAgent.completedTasks}/{selectedAgent.assignedTasks} complete
                      </span>
                    </div>
                  </div>
                </section>

                {/* Tasks Section */}
                <section className="detail-card tasks-card">
                  <div className="card-header">
                    <h3>Active Tasks</h3>
                    <button className="btn-add-task" onClick={() => setShowTaskForm(!showTaskForm)}>
                      + New Task
                    </button>
                  </div>

                  {showTaskForm && (
                    <div className="task-form">
                      <input
                        type="text"
                        placeholder="Task description..."
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="task-input"
                      />
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        className="task-select"
                      >
                        <option value="low">Low Priority</option>
                        <option value="normal">Normal Priority</option>
                        <option value="high">High Priority</option>
                        <option value="critical">Critical</option>
                      </select>
                      <div className="form-actions">
                        <button className="btn-save" onClick={handleAssignTask}>
                          Assign Task
                        </button>
                        <button className="btn-cancel" onClick={() => setShowTaskForm(false)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="tasks-list">
                    {selectedAgent.tasks.map((task) => (
                      <div key={task.id} className={`task-item status-${task.status}`}>
                        <div className="task-header">
                          <h4>{task.title}</h4>
                          <span
                            className="priority-badge"
                            style={{ background: getPriorityColor(task.priority) + '33' }}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <div className="task-status">
                          <span
                            className="status-indicator"
                            style={{ background: getStatusColor(task.status) }}
                          ></span>
                          <span className="status-text">{task.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Performance Insights */}
                <section className="detail-card insights-card">
                  <h3>Performance Insights</h3>
                  <div className="insights-grid">
                    <div className="insight">
                      <span className="insight-icon">📈</span>
                      <div>
                        <p className="insight-title">Trending Up</p>
                        <p className="insight-text">Performance improving +12% this week</p>
                      </div>
                    </div>
                    <div className="insight">
                      <span className="insight-icon">⚡</span>
                      <div>
                        <p className="insight-title">High Velocity</p>
                        <p className="insight-text">Completing tasks 15% faster than average</p>
                      </div>
                    </div>
                    <div className="insight">
                      <span className="insight-icon">🎯</span>
                      <div>
                        <p className="insight-title">Quality Score</p>
                        <p className="insight-text">Decision accuracy at 87%</p>
                      </div>
                    </div>
                    <div className="insight">
                      <span className="insight-icon">🚀</span>
                      <div>
                        <p className="insight-title">Next Milestone</p>
                        <p className="insight-text">Path to 75% expertise in 14 days</p>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .agent-management {
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

        .management-container {
          position: relative;
          z-index: 10;
          max-width: 1600px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .management-header {
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .management-header h1 {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .management-header p {
          color: #a5b4fc;
          font-size: 14px;
        }

        .management-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
        }

        .agents-sidebar {
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.6) 0%, rgba(20, 28, 60, 0.4) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 20px;
          backdrop-filter: blur(10px);
          height: fit-content;
          position: sticky;
          top: 20px;
        }

        .agents-sidebar h2 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #60a5fa;
        }

        .agents-scroll {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .agent-card {
          padding: 14px;
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .agent-card:hover {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .agent-card.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .agent-card-header {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
        }

        .agent-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }

        .agent-card-info h3 {
          font-size: 13px;
          font-weight: 700;
          margin: 0 0 2px 0;
          color: #e0e6ff;
        }

        .agent-card-info p {
          font-size: 11px;
          color: #a5b4fc;
          margin: 0;
        }

        .agent-card-stats {
          display: flex;
          gap: 8px;
        }

        .stat-badge {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 6px 8px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 6px;
          text-align: center;
        }

        .stat-label {
          font-size: 9px;
          color: #a5b4fc;
          text-transform: uppercase;
          font-weight: 600;
        }

        .stat-value {
          font-size: 12px;
          color: #60a5fa;
          font-weight: 700;
        }

        .agent-details {
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

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .card-header h2,
        .card-header h3 {
          margin: 0;
          font-size: 18px;
          color: #60a5fa;
          font-weight: 700;
        }

        .agent-title h2 {
          margin-bottom: 4px;
        }

        .agent-role {
          display: block;
          font-size: 12px;
          color: #a5b4fc;
          font-weight: 500;
        }

        .agent-score {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        .metric label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: #a5b4fc;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .metric-bar {
          width: 100%;
          height: 8px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .metric-fill {
          height: 100%;
          transition: width 0.5s ease;
          border-radius: 4px;
        }

        .metric-text {
          font-size: 12px;
          color: #cbd5e1;
        }

        .btn-add-task {
          padding: 8px 14px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-add-task:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
        }

        .task-form {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          padding: 16px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
          flex-wrap: wrap;
        }

        .task-input,
        .task-select {
          padding: 10px 12px;
          background: rgba(30, 41, 82, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 6px;
          color: #e0e6ff;
          font-size: 12px;
          font-family: inherit;
        }

        .task-input {
          flex: 1;
          min-width: 200px;
        }

        .task-input::placeholder {
          color: #6b7280;
        }

        .task-select {
          min-width: 120px;
        }

        .form-actions {
          display: flex;
          gap: 8px;
          width: 100%;
        }

        .btn-save,
        .btn-cancel {
          padding: 10px 14px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-save {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          flex: 1;
        }

        .btn-cancel {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
        }

        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .task-item {
          padding: 12px;
          background: rgba(139, 92, 246, 0.05);
          border-left: 3px solid #8b5cf6;
          border-radius: 6px;
        }

        .task-item.status-completed {
          border-left-color: #10b981;
          background: rgba(34, 197, 94, 0.05);
        }

        .task-item.status-in-progress {
          border-left-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }

        .task-item.status-pending {
          border-left-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .task-header h4 {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          color: #e0e6ff;
        }

        .priority-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .task-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #a5b4fc;
        }

        .status-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .insight {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
        }

        .insight-icon {
          font-size: 24px;
          min-width: 30px;
          text-align: center;
        }

        .insight-title {
          font-size: 12px;
          font-weight: 700;
          color: #60a5fa;
          margin: 0 0 2px 0;
        }

        .insight-text {
          font-size: 11px;
          color: #cbd5e1;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .management-grid {
            grid-template-columns: 1fr;
          }

          .agents-sidebar {
            position: relative;
            top: auto;
          }

          .metrics-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .metrics-row {
            grid-template-columns: 1fr;
          }

          .insights-grid {
            grid-template-columns: 1fr;
          }

          .task-form {
            flex-direction: column;
          }

          .task-input {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentManagement;
