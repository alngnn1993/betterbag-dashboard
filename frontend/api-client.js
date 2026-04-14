/**
 * FINN API CLIENT SERVICE
 * Centralized API communication and data management
 * 
 * Purpose: Handle all API calls, caching, and error handling
 */

class FinnAPIClient {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
    this.token = null;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem('finn_token', token);
  }

  /**
   * Get authentication token
   */
  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('finn_token');
    }
    return this.token;
  }

  /**
   * Build headers with authentication
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Make API request with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${options.method || 'GET'}:${endpoint}`;

    // Check cache for GET requests
    if (options.method !== 'POST' && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - clear token and redirect to login
          this.clearAuth();
          throw new Error('Authentication failed');
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      // Cache successful GET requests
      if (options.method !== 'POST') {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (error) {
      console.error(`API Request Error (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Clear authentication
   */
  clearAuth() {
    this.token = null;
    localStorage.removeItem('finn_token');
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  // ============ DASHBOARD ENDPOINTS ============

  /**
   * Get dashboard overview
   */
  async getDashboardMetrics() {
    return this.request('/finn/dashboard/metrics', { method: 'GET' });
  }

  /**
   * Get expertise by domain
   */
  async getExpertise(domain) {
    return this.request(`/finn/expertise/${domain}`, { method: 'GET' });
  }

  /**
   * Get all expertise metrics
   */
  async getAllExpertise() {
    return this.request('/finn/expertise', { method: 'GET' });
  }

  // ============ SUB-AGENTS ENDPOINTS ============

  /**
   * Get all sub-agents
   */
  async getAgents() {
    return this.request('/finn/agents', { method: 'GET' });
  }

  /**
   * Get specific agent
   */
  async getAgent(agentId) {
    return this.request(`/finn/agents/${agentId}`, { method: 'GET' });
  }

  /**
   * Assign task to agent
   */
  async assignTask(agentId, task) {
    return this.request(`/finn/agents/${agentId}/task`, {
      method: 'POST',
      body: JSON.stringify(task)
    });
  }

  /**
   * Update agent task status
   */
  async updateTaskStatus(agentId, taskId, status) {
    return this.request(`/finn/agents/${agentId}/task/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // ============ DECISIONS ENDPOINTS ============

  /**
   * Get pending decisions
   */
  async getDecisions(filter = {}) {
    const params = new URLSearchParams(filter).toString();
    return this.request(`/finn/decisions?${params}`, { method: 'GET' });
  }

  /**
   * Get specific decision
   */
  async getDecision(decisionId) {
    return this.request(`/finn/decisions/${decisionId}`, { method: 'GET' });
  }

  /**
   * Approve decision
   */
  async approveDecision(decisionId) {
    return this.request(`/finn/decisions/${decisionId}/approve`, {
      method: 'POST'
    });
  }

  /**
   * Reject decision
   */
  async rejectDecision(decisionId, reason = '') {
    return this.request(`/finn/decisions/${decisionId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  /**
   * Record decision outcome
   */
  async recordDecisionOutcome(decisionId, outcome) {
    return this.request(`/finn/decisions/${decisionId}/outcome`, {
      method: 'POST',
      body: JSON.stringify(outcome)
    });
  }

  // ============ RECOMMENDATIONS ENDPOINTS ============

  /**
   * Get comprehensive recommendation
   */
  async getRecommendation(query, context = {}) {
    return this.request('/finn/recommend/comprehensive', {
      method: 'POST',
      body: JSON.stringify({ query, context })
    });
  }

  /**
   * Compare recommendation options
   */
  async compareOptions(options) {
    return this.request('/finn/recommend/compare-options', {
      method: 'POST',
      body: JSON.stringify({ options })
    });
  }

  /**
   * Get recommendation outcome prediction
   */
  async predictOutcome(recommendation, timeframe = 30) {
    return this.request('/finn/recommend/predict-outcome', {
      method: 'POST',
      body: JSON.stringify({ recommendation, timeframe })
    });
  }

  // ============ SEARCH ENDPOINTS ============

  /**
   * Semantic search
   */
  async semanticSearch(query, domain = 'all') {
    return this.request('/finn/search/semantic', {
      method: 'POST',
      body: JSON.stringify({ query, domain })
    });
  }

  /**
   * Get concept by ID
   */
  async getConcept(conceptId) {
    return this.request(`/finn/concepts/${conceptId}`, { method: 'GET' });
  }

  // ============ ANALYTICS ENDPOINTS ============

  /**
   * Get business metrics
   */
  async getBusinessMetrics(dateRange = '30days') {
    return this.request(`/finn/analytics/metrics?range=${dateRange}`, {
      method: 'GET'
    });
  }

  /**
   * Get decision analytics
   */
  async getDecisionAnalytics(dateRange = '30days') {
    return this.request(`/finn/analytics/decisions?range=${dateRange}`, {
      method: 'GET'
    });
  }

  /**
   * Get agent performance analytics
   */
  async getAgentAnalytics() {
    return this.request('/finn/analytics/agents', { method: 'GET' });
  }

  /**
   * Get trend data
   */
  async getTrends(metric = 'all', timeframe = '30days') {
    return this.request(
      `/finn/analytics/trends?metric=${metric}&timeframe=${timeframe}`,
      { method: 'GET' }
    );
  }

  // ============ EXPERTISE ENDPOINTS ============

  /**
   * Get expertise prediction
   */
  async getExpertisePrediction(domain, days = 90) {
    return this.request(
      `/finn/expertise/prediction/${domain}?days=${days}`,
      { method: 'GET' }
    );
  }

  /**
   * Get optimal learning path
   */
  async getOptimalLearningPath(domain) {
    return this.request(`/finn/expertise/optimal-path/${domain}`, {
      method: 'GET'
    });
  }

  /**
   * Get mastery timeline
   */
  async getMasteryTimeline() {
    return this.request('/finn/expertise/mastery-timeline', { method: 'GET' });
  }

  // ============ SYNTHESIS ENDPOINTS ============

  /**
   * Get cross-domain synthesis
   */
  async getCrossDomainSynthesis() {
    return this.request('/finn/synthesis/cross-domain', { method: 'GET' });
  }

  /**
   * Get strategic synthesis
   */
  async getStrategicSynthesis(domains = []) {
    return this.request('/finn/synthesis/strategic', {
      method: 'POST',
      body: JSON.stringify({ domains })
    });
  }

  // ============ REPORTS ENDPOINTS ============

  /**
   * Get expertise report
   */
  async getExpertiseReport(domain) {
    return this.request(`/finn/reports/expertise/${domain}`, { method: 'GET' });
  }

  /**
   * Generate custom report
   */
  async generateReport(type, options = {}) {
    return this.request('/finn/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ type, options })
    });
  }

  /**
   * Export report as PDF
   */
  async exportReportPDF(reportId) {
    return this.request(`/finn/reports/${reportId}/export/pdf`, {
      method: 'GET'
    });
  }

  // ============ SETTINGS ENDPOINTS ============

  /**
   * Get user settings
   */
  async getSettings() {
    return this.request('/finn/settings', { method: 'GET' });
  }

  /**
   * Update user settings
   */
  async updateSettings(settings) {
    return this.request('/finn/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences() {
    return this.request('/finn/settings/notifications', { method: 'GET' });
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences) {
    return this.request('/finn/settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }

  // ============ HEALTH CHECK ============

  /**
   * Health check / connection test
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET'
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
const apiClient = new FinnAPIClient(
  process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
);

export default apiClient;
