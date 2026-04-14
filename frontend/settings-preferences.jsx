import React, { useState } from 'react';

const SettingsPreferences = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      decisionNotifications: true,
      dailyReport: true,
      weeklyDigest: true
    },
    preferences: {
      theme: 'dark',
      language: 'english',
      timeFormat: '24h',
      dataRefresh: '5min'
    },
    privacy: {
      shareInsights: true,
      analytics: true,
      crashReports: true
    },
    system: {
      autoBackup: true,
      cacheOptimization: true,
      performanceMode: true
    }
  });

  const [activeTab, setActiveTab] = useState('notifications');

  const handleToggle = (category, key) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  };

  const handleSelect = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <div className="settings-preferences">
      <div className="background-gradient"></div>
      <div className="animated-grid"></div>

      <div className="settings-container">
        {/* Header */}
        <header className="settings-header">
          <h1>Settings & Preferences</h1>
          <p>Customize Finn to match your workflow</p>
        </header>

        <div className="settings-layout">
          {/* Sidebar: Tab Navigation */}
          <aside className="settings-sidebar">
            <nav className="settings-nav">
              {[
                { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
                { id: 'preferences', label: '⚙️ Preferences', icon: '⚙️' },
                { id: 'privacy', label: '🔒 Privacy', icon: '🔒' },
                { id: 'system', label: '⚡ System', icon: '⚡' },
                { id: 'about', label: 'ℹ️ About', icon: 'ℹ️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="nav-icon">{tab.icon}</span>
                  <span className="nav-label">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main: Settings Content */}
          <main className="settings-content">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <section className="settings-section">
                <h2>Notification Settings</h2>
                <p className="section-desc">Control how you receive updates from Finn</p>

                <div className="settings-group">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Email Alerts</h4>
                      <p>Receive important notifications via email</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailAlerts}
                        onChange={() => handleToggle('notifications', 'emailAlerts')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Decision Notifications</h4>
                      <p>Get notified when new decisions are ready for approval</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.decisionNotifications}
                        onChange={() => handleToggle('notifications', 'decisionNotifications')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Daily Report</h4>
                      <p>Receive a daily summary of metrics and decisions</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.dailyReport}
                        onChange={() => handleToggle('notifications', 'dailyReport')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Weekly Digest</h4>
                      <p>Get a comprehensive weekly report of learning progress</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.notifications.weeklyDigest}
                        onChange={() => handleToggle('notifications', 'weeklyDigest')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </section>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <section className="settings-section">
                <h2>Preferences</h2>
                <p className="section-desc">Customize your experience</p>

                <div className="settings-group">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Theme</h4>
                      <p>Choose your preferred interface theme</p>
                    </div>
                    <select
                      value={settings.preferences.theme}
                      onChange={(e) => handleSelect('preferences', 'theme', e.target.value)}
                      className="select-input"
                    >
                      <option value="dark">Dark (Default)</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Language</h4>
                      <p>Select your preferred language</p>
                    </div>
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => handleSelect('preferences', 'language', e.target.value)}
                      className="select-input"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Español</option>
                      <option value="french">Français</option>
                      <option value="german">Deutsch</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Time Format</h4>
                      <p>How to display times and dates</p>
                    </div>
                    <select
                      value={settings.preferences.timeFormat}
                      onChange={(e) => handleSelect('preferences', 'timeFormat', e.target.value)}
                      className="select-input"
                    >
                      <option value="24h">24-Hour</option>
                      <option value="12h">12-Hour (AM/PM)</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Data Refresh Rate</h4>
                      <p>How often dashboard data updates</p>
                    </div>
                    <select
                      value={settings.preferences.dataRefresh}
                      onChange={(e) => handleSelect('preferences', 'dataRefresh', e.target.value)}
                      className="select-input"
                    >
                      <option value="1min">Every Minute</option>
                      <option value="5min">Every 5 Minutes</option>
                      <option value="15min">Every 15 Minutes</option>
                      <option value="30min">Every 30 Minutes</option>
                    </select>
                  </div>
                </div>
              </section>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <section className="settings-section">
                <h2>Privacy & Data</h2>
                <p className="section-desc">Control how your data is used</p>

                <div className="settings-group">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Share Learning Insights</h4>
                      <p>Help improve Finn by sharing anonymized insights</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.privacy.shareInsights}
                        onChange={() => handleToggle('privacy', 'shareInsights')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Analytics</h4>
                      <p>Allow us to collect usage analytics</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.privacy.analytics}
                        onChange={() => handleToggle('privacy', 'analytics')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Crash Reports</h4>
                      <p>Send crash and error reports automatically</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.privacy.crashReports}
                        onChange={() => handleToggle('privacy', 'crashReports')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="privacy-actions">
                  <button className="action-btn">📥 Export My Data</button>
                  <button className="action-btn delete">🗑️ Delete All Data</button>
                </div>
              </section>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <section className="settings-section">
                <h2>System Settings</h2>
                <p className="section-desc">Advanced system configuration</p>

                <div className="settings-group">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Auto Backup</h4>
                      <p>Automatically backup your data daily</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.system.autoBackup}
                        onChange={() => handleToggle('system', 'autoBackup')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Cache Optimization</h4>
                      <p>Optimize local caching for better performance</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.system.cacheOptimization}
                        onChange={() => handleToggle('system', 'cacheOptimization')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Performance Mode</h4>
                      <p>Reduce animations for faster response times</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={settings.system.performanceMode}
                        onChange={() => handleToggle('system', 'performanceMode')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="system-info">
                  <h4>System Information</h4>
                  <div className="info-item">
                    <span className="info-label">Version:</span>
                    <span className="info-value">3.0.0</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Storage Used:</span>
                    <span className="info-value">2.3 GB / 100 GB</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Backup:</span>
                    <span className="info-value">Today at 02:30 AM</span>
                  </div>
                </div>
              </section>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <section className="settings-section">
                <h2>About Finn</h2>
                
                <div className="about-content">
                  <div className="about-card">
                    <h3>🚀 Finn AI CEO</h3>
                    <p>Version 3.0.0 • Build 2026.04.14</p>
                  </div>

                  <div className="about-card">
                    <h3>📊 System Status</h3>
                    <div className="status-item">
                      <span>Backend API:</span>
                      <span className="status-ok">✓ Operational</span>
                    </div>
                    <div className="status-item">
                      <span>Database:</span>
                      <span className="status-ok">✓ Connected</span>
                    </div>
                    <div className="status-item">
                      <span>Sub-Agents:</span>
                      <span className="status-ok">✓ 5/5 Active</span>
                    </div>
                  </div>

                  <div className="about-card">
                    <h3>🎯 Key Metrics</h3>
                    <div className="metric">
                      <span>Overall Expertise:</span>
                      <span className="value">62%</span>
                    </div>
                    <div className="metric">
                      <span>Concepts Learned:</span>
                      <span className="value">47</span>
                    </div>
                    <div className="metric">
                      <span>Decisions Tracked:</span>
                      <span className="value">34</span>
                    </div>
                  </div>

                  <div className="about-card">
                    <h3>📚 Documentation</h3>
                    <a href="#" className="doc-link">→ View User Guide</a>
                    <a href="#" className="doc-link">→ API Documentation</a>
                    <a href="#" className="doc-link">→ Privacy Policy</a>
                    <a href="#" className="doc-link">→ Terms of Service</a>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .settings-preferences {
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

        .settings-container {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .settings-header {
          margin-bottom: 40px;
          padding: 30px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .settings-header h1 {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .settings-header p {
          color: #a5b4fc;
          font-size: 14px;
          margin: 0;
        }

        .settings-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 24px;
        }

        .settings-sidebar {
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.6) 0%, rgba(20, 28, 60, 0.4) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 16px;
          backdrop-filter: blur(10px);
          height: fit-content;
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(59, 130, 246, 0.05);
          border: 1px solid rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          color: #a5b4fc;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.2));
          border-color: rgba(59, 130, 246, 0.5);
          color: #60a5fa;
        }

        .nav-icon {
          font-size: 18px;
        }

        .settings-content {
          background: linear-gradient(135deg, rgba(30, 41, 82, 0.6) 0%, rgba(20, 28, 60, 0.4) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 32px;
          backdrop-filter: blur(10px);
        }

        .settings-section h2 {
          font-size: 22px;
          font-weight: 800;
          color: #e0e6ff;
          margin: 0 0 8px 0;
        }

        .section-desc {
          font-size: 13px;
          color: #a5b4fc;
          margin: 0 0 24px 0;
        }

        .settings-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.1);
          border-radius: 8px;
        }

        .setting-info h4 {
          font-size: 14px;
          font-weight: 700;
          color: #e0e6ff;
          margin: 0 0 4px 0;
        }

        .setting-info p {
          font-size: 12px;
          color: #a5b4fc;
          margin: 0;
        }

        .toggle {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 28px;
          cursor: pointer;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(59, 130, 246, 0.2);
          transition: 0.3s;
          border-radius: 14px;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
        }

        .toggle input:checked + .toggle-slider {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }

        .toggle input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        .select-input {
          padding: 8px 12px;
          background: rgba(15, 23, 41, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 6px;
          color: #e0e6ff;
          font-size: 13px;
          font-family: inherit;
          cursor: pointer;
        }

        .select-input:focus {
          outline: none;
          border-color: rgba(59, 130, 246, 0.6);
        }

        .privacy-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .action-btn {
          padding: 10px 16px;
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid rgba(59, 130, 246, 0.3);
          border-radius: 6px;
          color: #60a5fa;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: rgba(59, 130, 246, 0.3);
        }

        .action-btn.delete {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .action-btn.delete:hover {
          background: rgba(239, 68, 68, 0.3);
        }

        .system-info {
          margin-top: 24px;
          padding: 16px;
          background: rgba(59, 130, 246, 0.05);
          border-radius: 8px;
        }

        .system-info h4 {
          font-size: 13px;
          font-weight: 700;
          color: #60a5fa;
          margin: 0 0 12px 0;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          color: #a5b4fc;
          font-size: 12px;
        }

        .info-value {
          color: #60a5fa;
          font-weight: 600;
        }

        .about-content {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .about-card {
          padding: 20px;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 8px;
        }

        .about-card h3 {
          font-size: 15px;
          font-weight: 700;
          color: #e0e6ff;
          margin: 0 0 12px 0;
        }

        .about-card p {
          color: #a5b4fc;
          font-size: 12px;
          margin: 0;
        }

        .status-item,
        .metric {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 12px;
          border-bottom: 1px solid rgba(139, 92, 246, 0.1);
        }

        .status-item:last-child,
        .metric:last-child {
          border-bottom: none;
        }

        .status-item span:first-child,
        .metric span:first-child {
          color: #a5b4fc;
        }

        .status-ok {
          color: #10b981;
          font-weight: 600;
        }

        .value {
          color: #60a5fa;
          font-weight: 700;
        }

        .doc-link {
          display: block;
          color: #3b82f6;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          padding: 8px 0;
          transition: all 0.2s ease;
        }

        .doc-link:hover {
          color: #60a5fa;
        }

        @media (max-width: 768px) {
          .settings-layout {
            grid-template-columns: 1fr;
          }

          .settings-sidebar {
            position: relative;
          }

          .about-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default SettingsPreferences;
