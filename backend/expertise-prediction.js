/**
 * FINN EXPERTISE PREDICTION SYSTEM
 * Advanced Expertise Growth Forecasting
 * 
 * Purpose: Predict and optimize Finn's expertise growth
 * - Learning trajectory prediction
 * - Expertise forecasting
 * - Knowledge gap filling strategy
 * - Growth optimization
 */

class ExpertisePredictionSystem {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Predict expertise growth trajectory
   */
  async predictExpertiseTrajectory(domain, days = 90) {
    try {
      // Get current expertise
      const { data: current } = await this.supabase
        .from('expertise_metrics')
        .select('*')
        .eq('domain', domain)
        .single();

      if (!current) {
        return { error: `No expertise data for ${domain}` };
      }

      // Get historical data
      const { data: historicalConcepts } = await this.supabase
        .from('concepts')
        .select('*')
        .eq('category', domain)
        .order('created_at', { ascending: true });

      // Calculate learning velocity
      const velocity = this.calculateLearningVelocity(historicalConcepts);

      // Project trajectory
      const trajectory = [];
      let projectedExpertise = current.expertise_level;

      for (let day = 0; day <= days; day += 7) {
        const weeklyGain = velocity * (current.expertise_level < 50 ? 1.5 : 0.8);
        projectedExpertise = Math.min(projectedExpertise + weeklyGain, 100);

        trajectory.push({
          day: day,
          expertise: Math.round(projectedExpertise),
          milestone: this.getExpertiseMilestone(projectedExpertise)
        });
      }

      return {
        domain: domain,
        currentLevel: current.expertise_level,
        projectedLevel: projectedExpertise,
        trajectory: trajectory,
        daysToMastery: this.calculateDaysToMastery(
          current.expertise_level,
          velocity
        ),
        confidenceScore: this.calculateConfidenceScore(historicalConcepts)
      };
    } catch (error) {
      console.error('Trajectory prediction error:', error);
      return { error: error.message };
    }
  }

  /**
   * Calculate learning velocity
   */
  calculateLearningVelocity(concepts) {
    if (!concepts || concepts.length < 2) return 0;

    // Calculate concepts per day
    const first = new Date(concepts[0].created_at);
    const last = new Date(concepts[concepts.length - 1].created_at);
    const days = (last - first) / (1000 * 60 * 60 * 24);

    return days > 0 ? concepts.length / days : 0;
  }

  /**
   * Get expertise milestone
   */
  getExpertiseMilestone(level) {
    if (level < 20) return 'Beginner';
    if (level < 40) return 'Developing';
    if (level < 60) return 'Proficient';
    if (level < 80) return 'Advanced';
    if (level < 95) return 'Expert';
    return 'Master';
  }

  /**
   * Calculate days to mastery
   */
  calculateDaysToMastery(currentLevel, velocity) {
    if (velocity === 0) return Infinity;

    const masterLevel = 90;
    const remaining = masterLevel - currentLevel;
    const dailyGain = velocity * (currentLevel < 50 ? 1.5 : 0.8);

    return dailyGain > 0 ? Math.ceil(remaining / dailyGain) : Infinity;
  }

  /**
   * Calculate confidence score
   */
  calculateConfidenceScore(concepts) {
    if (!concepts || concepts.length === 0) return 0;

    // Higher concept count = higher confidence
    const conceptScore = Math.min((concepts.length / 20) * 50, 50);

    // Importance distribution
    const importanceMap = {
      critical: 3,
      high: 2,
      medium: 1,
      low: 0.5
    };

    let importanceScore = 0;
    concepts.forEach(c => {
      importanceScore +=
        importanceMap[c.importance] || 1;
    });
    importanceScore = Math.min((importanceScore / concepts.length / 2) * 50, 50);

    return Math.round(conceptScore + importanceScore);
  }

  /**
   * Predict optimal learning path
   */
  async predictOptimalLearningPath(domain) {
    try {
      // Get expertise metrics
      const { data: expertise } = await this.supabase
        .from('expertise_metrics')
        .select('*')
        .eq('domain', domain)
        .single();

      // Get all concepts in domain
      const { data: concepts } = await this.supabase
        .from('concepts')
        .select('*')
        .eq('category', domain)
        .order('created_at', { ascending: true });

      // Identify critical gaps
      const gaps = this.identifyCriticalGaps(concepts);

      // Generate learning path
      const learningPath = this.generateLearningPath(domain, gaps);

      return {
        domain: domain,
        currentLevel: expertise?.expertise_level || 0,
        gaps: gaps,
        recommendedPath: learningPath,
        estimatedTimeToMastery: `${this.calculateDaysToMastery(expertise?.expertise_level || 0, 0.5)} days`
      };
    } catch (error) {
      console.error('Learning path prediction error:', error);
      return { error: error.message };
    }
  }

  /**
   * Identify critical knowledge gaps
   */
  identifyCriticalGaps(concepts) {
    if (!concepts || concepts.length === 0) return [];

    // Group by importance
    const critical = concepts.filter(c => c.importance === 'critical');
    const high = concepts.filter(c => c.importance === 'high');

    // If less than 50% of critical concepts known, they are gaps
    const gaps = [];

    if (critical.length < 5) {
      gaps.push({
        type: 'critical_concepts',
        count: 5 - critical.length,
        priority: 'critical'
      });
    }

    if (high.length < 10) {
      gaps.push({
        type: 'high_value_concepts',
        count: 10 - high.length,
        priority: 'high'
      });
    }

    return gaps;
  }

  /**
   * Generate learning path
   */
  generateLearningPath(domain, gaps) {
    const paths = {
      finance: [
        'Unit Economics Mastery',
        'CAC & LTV Deep Dive',
        'Pricing Strategy',
        'Financial Forecasting',
        'Cash Flow Management'
      ],
      marketing: [
        'Customer Acquisition Channels',
        'Conversion Optimization',
        'Channel Attribution',
        'Customer Segmentation',
        'Campaign Strategy'
      ],
      operations: [
        'Process Optimization',
        'Inventory Management',
        'Quality Systems',
        'Supply Chain',
        'Efficiency Metrics'
      ],
      strategy: [
        'Competitive Analysis',
        'Market Positioning',
        'Growth Strategy',
        'Risk Management',
        'Long-term Vision'
      ]
    };

    return paths[domain] || [];
  }

  /**
   * Predict mastery timeline
   */
  async predictMasteryTimeline(userId) {
    try {
      // Get all expertise metrics
      const { data: expertise } = await this.supabase
        .from('expertise_metrics')
        .select('*')
        .eq('user_id', userId || 'default');

      if (!expertise || expertise.length === 0) {
        return { error: 'No expertise data' };
      }

      const timeline = {};

      for (const domain of expertise) {
        const daysToMastery = this.calculateDaysToMastery(
          domain.expertise_level,
          0.5
        );

        timeline[domain.domain] = {
          current: domain.expertise_level,
          daysToMastery: daysToMastery,
          estimatedDate: new Date(
            Date.now() + daysToMastery * 24 * 60 * 60 * 1000
          ).toISOString()
        };
      }

      // Find next domain to master
      const nextToMaster = Object.entries(timeline).sort(
        (a, b) => a[1].daysToMastery - b[1].daysToMastery
      )[0];

      return {
        timeline: timeline,
        nextDomainToMaster: nextToMaster ? nextToMaster[0] : null,
        nextDaysRemaining: nextToMaster ? nextToMaster[1].daysToMastery : null
      };
    } catch (error) {
      console.error('Mastery timeline prediction error:', error);
      return { error: error.message };
    }
  }

  /**
   * Recommend learning focus
   */
  async recommendLearningFocus() {
    try {
      // Get all expertise
      const { data: expertise } = await this.supabase
        .from('expertise_metrics')
        .select('*');

      if (!expertise || expertise.length === 0) {
        return { recommendation: 'Start with finance fundamentals' };
      }

      // Sort by expertise level
      const sorted = expertise.sort((a, b) => a.expertise_level - b.expertise_level);

      // Focus on weakest domain
      const weakest = sorted[0];

      // But also recommend breadth
      const wellRounded = sorted.filter(e => e.expertise_level < 50).length;

      let recommendation;

      if (wellRounded > 3) {
        recommendation = `Focus on deepening ${weakest.domain} (currently ${weakest.expertise_level}%)`;
      } else {
        recommendation = `Build breadth - focus on ${weakest.domain}`;
      }

      return {
        currentFocus: weakest.domain,
        currentLevel: weakest.expertise_level,
        recommendation: recommendation,
        strategy:
          wellRounded > 3 ? 'Depth' : 'Breadth'
      };
    } catch (error) {
      console.error('Learning recommendation error:', error);
      return { error: error.message };
    }
  }

  /**
   * Estimate expertise by month
   */
  async estimateExpertiseByMonth(domain, months = 12) {
    try {
      // Get current expertise
      const { data: current } = await this.supabase
        .from('expertise_metrics')
        .select('*')
        .eq('domain', domain)
        .single();

      if (!current) {
        return { error: `No data for ${domain}` };
      }

      const monthlyEstimates = [];
      let expertise = current.expertise_level;

      for (let month = 1; month <= months; month++) {
        // Model: faster growth at lower levels, slower at higher levels
        const growthRate = expertise < 50 ? 8 : expertise < 80 ? 5 : 2;
        expertise = Math.min(expertise + growthRate, 100);

        monthlyEstimates.push({
          month: month,
          estimatedExpertise: Math.round(expertise),
          milestone: this.getExpertiseMilestone(expertise)
        });
      }

      return {
        domain: domain,
        estimates: monthlyEstimates,
        finalProjection: expertise
      };
    } catch (error) {
      console.error('Monthly estimation error:', error);
      return { error: error.message };
    }
  }
}

module.exports = ExpertisePredictionSystem;
