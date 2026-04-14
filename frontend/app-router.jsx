import React, { useState } from 'react';

// Import all dashboard components
import FinnDashboard from './finn-dashboard';
import AgentManagement from './agent-management';
import DecisionCenter from './decision-center';
import KnowledgeSearch from './knowledge-search';
import ExpertiseReports from './expertise-reports';
import SettingsPreferences from './settings-preferences';
import ReportsAnalytics from './reports-analytics';

const AppRouter = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      component: FinnDashboard
    },
    {
      id: 'agents',
      label: 'Sub-Agents',
      icon: '👥',
      component: AgentManagement
    },
    {
      id: 'decisions',
      label: 'Decisions',
      icon: '🎯',
      component: DecisionCenter
    },
    {
      id: 'search',
      label: 'Knowledge',
      icon: '🔍',
      component: KnowledgeSearch
    },
    {
      id: 'expertise',
      label: 'Expertise',
      icon: '📈',
      component: ExpertiseReports
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📉',
      component: ReportsAnalytics
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      component: SettingsPreferences
    }
  ];

  const CurrentComponent = navigationItems.find(item => item.id === currentPage)?.component || FinnDashboard;

  return (
    <div className="app-router">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="nav-left">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="app-title">⚡ FINN AI CEO</h1>
        </div>

        <div className="nav-right">
          <div className="nav-status">
            <span className="status-dot"></span>
            <span className="status-text">System Online</span>
          </div>
          <div className="user-profile">
            <div className="profile-avatar">AN</div>
            <span className="profile-name">Alexander</span>
          </div>
        </div>
      </nav>

      <div className="app-layout">
        {/* Sidebar Navigation */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-content">
            <div className="nav-section">
              <h3>Main</h3>
              <ul className="nav-list">
                {navigationItems.slice(0, 4).map(item => (
                  <li key={item.id}>
                    <button
                      className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                      onClick={() => setCurrentPage(item.id)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {sidebarOpen && <span className="nav-text">{item.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav-section">
              <h3>Analytics</h3>
              <ul className="nav-list">
                {navigationItems.slice(4, 6).map(item => (
                  <li key={item.id}>
                    <button
                      className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                      onClick={() => setCurrentPage(item.id)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {sidebarOpen && <span className="nav-text">{item.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav-section">
              <h3>System</h3>
              <ul className="nav-list">
                {navigationItems.slice(6).map(item => (
                  <li key={item.id}>
                    <button
                      className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                      onClick={() => setCurrentPage(item.id)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {sidebarOpen && <span className="nav-text">{item.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="sidebar-footer">
            <div className="version-info">
              <span className="version-label">Version</span>
              <span className="version-number">3.0.0</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <div className="page-wrapper">
            <CurrentComponent />
          </div>
        </main>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-router {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0f1729 100%);
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #e0e6ff;
        }

        /* Top Navigation */
        .top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
          padding: 0 20px;
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.8) 0%, rgba(20, 28, 60, 0.6) 100%);
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .menu-toggle {
          background: none;
          border: none;
          color: #60a5fa;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .menu-toggle:hover {
          color: #93c5fd;
        }

        .app-title {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-status {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-text {
          font-size: 12px;
          color: #a5b4fc;
          font-weight: 600;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
        }

        .profile-name {
          font-size: 12px;
          color: #a5b4fc;
          font-weight: 600;
        }

        /* Layout */
        .app-layout {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        /* Sidebar */
        .sidebar {
          width: 240px;
          background: linear-gradient(180deg, rgba(20, 28, 60, 0.8) 0%, rgba(10, 14, 39, 0.6) 100%);
          border-right: 1px solid rgba(59, 130, 246, 0.2);
          overflow-y: auto;
          transition: width 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .sidebar.closed {
          width: 80px;
        }

        .sidebar-content {
          flex: 1;
          padding: 20px 8px;
        }

        .nav-section {
          margin-bottom: 24px;
        }

        .nav-section h3 {
          font-size: 11px;
          text-transform: uppercase;
          color: #6b7280;
          font-weight: 700;
          padding: 8px 12px;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .sidebar.closed .nav-section h3 {
          display: none;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          color: #a5b4fc;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .nav-link:hover {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .nav-link.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.2));
          border-color: rgba(59, 130, 246, 0.5);
          color: #60a5fa;
        }

        .nav-icon {
          font-size: 18px;
          min-width: 24px;
          text-align: center;
        }

        .nav-text {
          flex: 1;
        }

        .sidebar.closed .nav-text {
          display: none;
        }

        .sidebar-footer {
          padding: 16px 8px;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
          text-align: center;
        }

        .version-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .version-label {
          font-size: 10px;
          color: #6b7280;
          text-transform: uppercase;
          font-weight: 700;
        }

        .version-number {
          font-size: 12px;
          color: #60a5fa;
          font-weight: 700;
        }

        .sidebar.closed .version-label {
          display: none;
        }

        /* Main Content */
        .main-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .page-wrapper {
          width: 100%;
          min-height: 100%;
        }

        /* Scrollbar Styling */
        .main-content::-webkit-scrollbar,
        .sidebar::-webkit-scrollbar {
          width: 8px;
        }

        .main-content::-webkit-scrollbar-track,
        .sidebar::-webkit-scrollbar-track {
          background: rgba(59, 130, 246, 0.05);
        }

        .main-content::-webkit-scrollbar-thumb,
        .sidebar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 4px;
        }

        .main-content::-webkit-scrollbar-thumb:hover,
        .sidebar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 70px;
            height: calc(100vh - 70px);
            z-index: 50;
            box-shadow: 4px 0 12px rgba(0, 0, 0, 0.3);
          }

          .sidebar.closed {
            transform: translateX(-100%);
            width: 240px;
          }

          .app-layout {
            flex-direction: column;
          }

          .main-content {
            width: 100%;
          }

          .profile-name {
            display: none;
          }

          .sidebar.closed {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default AppRouter;
