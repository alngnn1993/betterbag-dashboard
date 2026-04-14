/**
 * FINN REACT HOOKS
 * Custom React hooks for data fetching and state management
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from './api-client';

/**
 * Hook: Fetch data with loading and error states
 */
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheRef = useRef({});

  const fetchData = useCallback(async () => {
    // Check cache
    if (cacheRef.current[url]) {
      setData(cacheRef.current[url]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await apiClient.request(url, options);
      setData(result);
      cacheRef.current[url] = result;
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    delete cacheRef.current[url];
    fetchData();
  }, [url, fetchData]);

  return { data, loading, error, refetch };
};

/**
 * Hook: Dashboard metrics
 */
export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await apiClient.getDashboardMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();

    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return { metrics, loading, error };
};

/**
 * Hook: Expertise data
 */
export const useExpertise = (domain = null) => {
  const [expertise, setExpertise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpertise = async () => {
      try {
        const data = domain
          ? await apiClient.getExpertise(domain)
          : await apiClient.getAllExpertise();
        setExpertise(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpertise();
  }, [domain]);

  return { expertise, loading, error };
};

/**
 * Hook: Sub-agents
 */
export const useAgents = () => {
  const [agents, setAgents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAgents = useCallback(async () => {
    try {
      const data = await apiClient.getAgents();
      setAgents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const assignTask = useCallback(
    async (agentId, task) => {
      try {
        await apiClient.assignTask(agentId, task);
        fetchAgents(); // Refresh
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [fetchAgents]
  );

  return { agents, loading, error, assignTask, refetch: fetchAgents };
};

/**
 * Hook: Decisions
 */
export const useDecisions = (filter = {}) => {
  const [decisions, setDecisions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDecisions = useCallback(async () => {
    try {
      const data = await apiClient.getDecisions(filter);
      setDecisions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchDecisions();
  }, [fetchDecisions]);

  const approveDecision = useCallback(
    async (decisionId) => {
      try {
        await apiClient.approveDecision(decisionId);
        fetchDecisions();
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [fetchDecisions]
  );

  const rejectDecision = useCallback(
    async (decisionId, reason) => {
      try {
        await apiClient.rejectDecision(decisionId, reason);
        fetchDecisions();
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [fetchDecisions]
  );

  return {
    decisions,
    loading,
    error,
    approveDecision,
    rejectDecision,
    refetch: fetchDecisions
  };
};

/**
 * Hook: Search
 */
export const useSemanticSearch = (query, domain = 'all') => {
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (q, d) => {
    if (!q) {
      setResults(null);
      return;
    }

    try {
      setSearching(true);
      const data = await apiClient.semanticSearch(q, d);
      setResults(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    search(query, domain);
  }, [query, domain, search]);

  return { results, searching, error, search };
};

/**
 * Hook: Analytics
 */
export const useAnalytics = (dateRange = '30days') => {
  const [metrics, setMetrics] = useState(null);
  const [decisions, setDecisions] = useState(null);
  const [agents, setAgents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [metricsData, decisionsData, agentsData] = await Promise.all([
          apiClient.getBusinessMetrics(dateRange),
          apiClient.getDecisionAnalytics(dateRange),
          apiClient.getAgentAnalytics()
        ]);

        setMetrics(metricsData);
        setDecisions(decisionsData);
        setAgents(agentsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  return { metrics, decisions, agents, loading, error };
};

/**
 * Hook: Recommendations
 */
export const useRecommendation = (query, context = {}) => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRecommendation = useCallback(async (q, ctx) => {
    try {
      setLoading(true);
      const data = await apiClient.getRecommendation(q, ctx);
      setRecommendation(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      getRecommendation(query, context);
    }
  }, [query, context, getRecommendation]);

  return { recommendation, loading, error, refetch: getRecommendation };
};

/**
 * Hook: Settings
 */
export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await apiClient.getSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(
    async (newSettings) => {
      try {
        const updated = await apiClient.updateSettings(newSettings);
        setSettings(updated);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    []
  );

  return { settings, loading, error, updateSettings, refetch: fetchSettings };
};

/**
 * Hook: API Health Check
 */
export const useAPIHealth = () => {
  const [healthy, setHealthy] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await apiClient.healthCheck();
      setHealthy(isHealthy);
      setChecking(false);
    };

    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return { healthy, checking };
};

/**
 * Hook: Paginated data
 */
export const usePaginatedFetch = (url, pageSize = 20) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const result = await apiClient.request(
          `${url}?page=${page}&pageSize=${pageSize}`
        );
        setData(result.data);
        setTotalPages(result.totalPages);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [url, page, pageSize]);

  return {
    data,
    page,
    totalPages,
    loading,
    error,
    goToPage: setPage,
    nextPage: () => setPage(p => p + 1),
    prevPage: () => setPage(p => Math.max(1, p - 1))
  };
};

export default {
  useFetch,
  useDashboardMetrics,
  useExpertise,
  useAgents,
  useDecisions,
  useSemanticSearch,
  useAnalytics,
  useRecommendation,
  useSettings,
  useAPIHealth,
  usePaginatedFetch
};
