/**
 * FINN EXPERTISE ALGORITHMS
 * Advanced Expertise Calculation System
 * 
 * Calculates Finn's expertise level across domains
 * Tracks learning velocity and confidence
 */

class ExpertiseCalculator {
  constructor() {
    this.domains = {
      finance: { weight: 1.0, criticalConcepts: 15 },
      marketing: { weight: 1.0, criticalConcepts: 12 },
      operations: { weight: 0.9, criticalConcepts: 10 },
      customer_success: { weight: 0.9, criticalConcepts: 10 },
      product: { weight: 0.9, criticalConcepts: 10 },
      strategy: { weight: 1.2, criticalConcepts: 20 },
      pricing: { weight: 1.1, criticalConcepts: 12 },
      growth: { weight: 1.0, criticalConcepts: 15 }
    };
  }

  /**
   * Calculate base expertise from concept count
   * Considers both quantity and quality of concepts
   */
  calculateConceptExpertise(conceptCount, domain) {
    const domainConfig = this.domains[domain];
    if (!domainConfig) return 0;

    const criticalConcepts = domainConfig.criticalConcepts;
    
    // Expertise increases logarithmically (diminishing returns)
    // 1 concept = 5%, 5 = 25%, 10 = 40%, 15 = 50%
    const baseExpertise = Math.min(
      (conceptCount / criticalConcepts) * 50,
      50
    );

    return baseExpertise;
  }

  /**
   * Calculate decision-based expertise
   * Quality and consistency of decisions matter
   */
  calculateDecisionExpertise(decisions, domain) {
    if (!decisions || decisions.length === 0) return 0;

    let scoreSum = 0;
    let decisionCount = 0;

    for (const decision of decisions) {
      if (decision.domain !== domain) continue;

      // Score based on approval and outcome
      let score = 0;
      if (decision.user_approval === 'approved') {
        score = 15; // Base score for approval
        if (decision.result_impact > 0.7) {
          score += 20; // Good outcome
        } else if (decision.result_impact > 0.3) {
          score += 10; // Acceptable outcome
        }
      } else if (decision.user_approval === 'rejected') {
        // Learn from rejection
        score = 5;
      }

      scoreSum += score;
      decisionCount++;
    }

    if (decisionCount === 0) return 0;

    const averageDecisionScore = scoreSum / decisionCount;
    // Normalize to 0-50
    return Math.min(averageDecisionScore / 2, 50);
  }

  /**
   * Calculate learning velocity
   * How fast is Finn learning in this domain?
   */
  calculateLearningVelocity(concepts, timeWindowDays = 7) {
    if (!concepts || concepts.length === 0) return 0;

    const now = new Date();
    const windowStart = new Date(now.getTime() - timeWindowDays * 24 * 60 * 60 * 1000);

    const recentConcepts = concepts.filter(c => {
      const createdAt = new Date(c.created_at);
      return createdAt >= windowStart;
    });

    // Concepts per day learned
    const velocity = recentConcepts.length / timeWindowDays;

    // Normalize (0-1 scale, assuming 2 concepts/day is "normal")
    return Math.min(velocity / 2, 1.0);
  }

  /**
   * Calculate concept quality score
   * Based on importance and relationships
   */
  calculateConceptQuality(concepts) {
    if (!concepts || concepts.length === 0) return 0;

    let qualityScore = 0;

    for (const concept of concepts) {
      let score = 10; // Base score

      // Importance multiplier
      const importanceMultiplier = {
        critical: 2.0,
        high: 1.5,
        medium: 1.0,
        low: 0.5
      };

      const multiplier = importanceMultiplier[concept.importance] || 1.0;
      score *= multiplier;

      qualityScore += score;
    }

    // Average quality, normalize to 0-100
    const averageQuality = (qualityScore / concepts.length) / 20 * 100;
    return Math.min(averageQuality, 100);
  }

  /**
   * Calculate confidence score
   * How confident is Finn in this domain?
   */
  calculateConfidenceScore(
    conceptCount,
    decisionCount,
    decisionAccuracy,
    learningVelocity
  ) {
    // Confidence based on multiple factors
    const knowledgeConfidence = Math.min(conceptCount / 10, 1.0) * 30;
    const experienceConfidence = Math.min(decisionCount / 20, 1.0) * 30;
    const performanceConfidence = decisionAccuracy * 25;
    const momentumConfidence = learningVelocity * 15;

    const totalConfidence =
      knowledgeConfidence +
      experienceConfidence +
      performanceConfidence +
      momentumConfidence;

    return Math.min(totalConfidence, 100);
  }

  /**
   * Calculate overall domain expertise
   * Combines all factors into single 0-100 score
   */
  calculateDomainExpertise(conceptData, decisionData, domain) {
    // Weights for different factors
    const weights = {
      concepts: 0.35,
      decisions: 0.35,
      quality: 0.20,
      confidence: 0.10
    };

    const conceptExpertise = this.calculateConceptExpertise(
      conceptData.count,
      domain
    );
    const decisionExpertise = this.calculateDecisionExpertise(
      decisionData,
      domain
    );
    const conceptQuality = this.calculateConceptQuality(conceptData.items);
    const learningVelocity = this.calculateLearningVelocity(conceptData.items);
    const decisionAccuracy = conceptData.count > 0 ? 0.7 : 0; // Placeholder
    const confidenceScore = this.calculateConfidenceScore(
      conceptData.count,
      decisionData.length,
      decisionAccuracy,
      learningVelocity
    );

    // Weighted sum
    const expertise =
      conceptExpertise * weights.concepts +
      decisionExpertise * weights.decisions +
      (conceptQuality / 100) * 50 * weights.quality +
      (confidenceScore / 100) * 50 * weights.confidence;

    return {
      overallExpertise: Math.min(expertise, 100),
      conceptExpertise: conceptExpertise,
      decisionExpertise: decisionExpertise,
      qualityScore: conceptQuality,
      confidenceScore: confidenceScore,
      learningVelocity: learningVelocity,
      breakdown: {
        fromConcepts: conceptExpertise * weights.concepts,
        fromDecisions: decisionExpertise * weights.decisions,
        fromQuality: (conceptQuality / 100) * 50 * weights.quality,
        fromConfidence: (confidenceScore / 100) * 50 * weights.confidence
      }
    };
  }

  /**
   * Predict future expertise
   * Based on current trajectory
   */
  predictExpertiseGrowth(currentExpertise, learningVelocity, daysAhead = 30) {
    // Linear growth model for now (can be enhanced)
    // 1 concept/day = ~3.3% expertise gain per day
    const dailyGainRate = (learningVelocity / 2) * 0.033;
    const projectedExpertise = Math.min(
      currentExpertise + dailyGainRate * daysAhead * 100,
      100
    );

    return {
      currentExpertise: currentExpertise,
      projectedExpertise: projectedExpertise,
      estimatedDaysTo70: currentExpertise < 70
        ? Math.ceil((70 - currentExpertise) / (dailyGainRate * 100))
        : 0,
      estimatedDaysTo90: currentExpertise < 90
        ? Math.ceil((90 - currentExpertise) / (dailyGainRate * 100))
        : 0
    };
  }

  /**
   * Identify expertise gaps
   * What should Finn focus on learning?
   */
  identifyPriorityAreas(domainExpertise) {
    const gaps = [];

    for (const [domain, expertise] of Object.entries(domainExpertise)) {
      if (expertise.overallExpertise < 30) {
        gaps.push({
          domain: domain,
          level: 'critical',
          currentExpertise: expertise.overallExpertise,
          priority: 1,
          reason: 'Insufficient knowledge in critical domain'
        });
      } else if (expertise.overallExpertise < 60) {
        gaps.push({
          domain: domain,
          level: 'high',
          currentExpertise: expertise.overallExpertise,
          priority: 2,
          reason: 'Need deeper understanding'
        });
      } else if (expertise.overallExpertise < 85) {
        gaps.push({
          domain: domain,
          level: 'medium',
          currentExpertise: expertise.overallExpertise,
          priority: 3,
          reason: 'Opportunity for specialization'
        });
      }
    }

    return gaps.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Generate expertise report
   */
  generateExpertiseReport(domainExpertise) {
    const report = {
      generatedAt: new Date().toISOString(),
      overallExpertise: this.calculateOverallExpertise(domainExpertise),
      byDomain: domainExpertise,
      gaps: this.identifyPriorityAreas(domainExpertise),
      topStrengths: this.identifyTopStrengths(domainExpertise),
      recommendations: this.generateRecommendations(domainExpertise)
    };

    return report;
  }

  /**
   * Calculate overall expertise across all domains
   */
  calculateOverallExpertise(domainExpertise) {
    const expertiseValues = Object.values(domainExpertise).map(
      d => d.overallExpertise
    );

    if (expertiseValues.length === 0) return 0;

    const sum = expertiseValues.reduce((a, b) => a + b, 0);
    return Math.round((sum / expertiseValues.length) * 10) / 10;
  }

  /**
   * Identify top strength areas
   */
  identifyTopStrengths(domainExpertise) {
    return Object.entries(domainExpertise)
      .sort((a, b) => b[1].overallExpertise - a[1].overallExpertise)
      .slice(0, 3)
      .map(([domain, expertise]) => ({
        domain: domain,
        expertise: Math.round(expertise.overallExpertise)
      }));
  }

  /**
   * Generate learning recommendations
   */
  generateRecommendations(domainExpertise) {
    const recommendations = [];

    // Recommend focusing on critical gaps
    const criticalGaps = Object.entries(domainExpertise)
      .filter(([_, e]) => e.overallExpertise < 30)
      .map(([d]) => d);

    if (criticalGaps.length > 0) {
      recommendations.push({
        priority: 1,
        action: `Focus on learning ${criticalGaps[0]} domain`,
        reason: `Current expertise is only ${Math.round(domainExpertise[criticalGaps[0]].overallExpertise)}%`
      });
    }

    // Recommend deepening in medium areas
    const mediumAreas = Object.entries(domainExpertise)
      .filter(([_, e]) => e.overallExpertise >= 60 && e.overallExpertise < 85)
      .map(([d]) => d);

    if (mediumAreas.length > 0) {
      recommendations.push({
        priority: 2,
        action: `Deepen expertise in ${mediumAreas[0]}`,
        reason: `Can reach mastery (90%+) with focused learning`
      });
    }

    return recommendations;
  }
}

module.exports = ExpertiseCalculator;
