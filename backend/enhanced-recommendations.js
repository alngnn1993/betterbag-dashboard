/**
 * FINN ENHANCED RECOMMENDATION ENGINE
 * Sophisticated Business Decision Recommendations
 * 
 * Purpose: Generate intelligent, context-aware business recommendations
 * - Multi-factor analysis
 * - Risk assessment
 * - Outcome prediction
 * - Alternative generation
 */

const Anthropic = require('@anthropic-ai/sdk');

class EnhancedRecommendationEngine {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
    this.anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });
  }

  /**
   * Generate comprehensive recommendation
   */
  async generateComprehensiveRecommendation(query, context = {}) {
    try {
      // Get relevant business data
      const businessData = await this.gatherBusinessContext(context);

      // Get Finn's expertise
      const expertise = await this.getExpertiseContext(context.userId);

      // Build comprehensive prompt
      const systemPrompt = `You are Finn, an AI CEO for BetterBag (takeout bag subscription).
Generate a comprehensive recommendation that includes:

1. PRIMARY RECOMMENDATION - What should be done
2. REASONING - Why this is recommended
3. EXPECTED OUTCOMES - What will likely happen
4. RISKS - What could go wrong
5. ALTERNATIVES - 2-3 other options considered
6. CONFIDENCE LEVEL - 0-100 confidence in recommendation
7. REQUIRED CONDITIONS - What needs to be true for recommendation to work
8. SUCCESS METRICS - How to measure if recommendation worked
9. TIMELINE - When to expect results
10. RESOURCE NEEDS - What's required to implement

Context:
- Expertise: ${JSON.stringify(expertise)}
- Business Data: ${JSON.stringify(businessData)}
- Your CAC: $${context.cac || 'unknown'}
- Your LTV: $${context.ltv || 'unknown'}
- Churn Rate: ${context.churn || 'unknown'}%

Return as JSON with all fields.`;

      const recommendation = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 2500,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: query
          }
        ]
      });

      const recommendationText = recommendation.content[0].text;
      const parsed = JSON.parse(recommendationText);

      return {
        success: true,
        recommendation: parsed,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Recommendation generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Gather business context
   */
  async gatherBusinessContext(context) {
    try {
      // Get financial metrics
      const { data: financialData } = await this.supabase
        .from('financial_metrics')
        .select('*')
        .order('date', { ascending: false })
        .limit(3);

      // Get recent decisions
      const { data: decisions } = await this.supabase
        .from('decisions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get customer data
      const { data: customers } = await this.supabase
        .from('customers')
        .select('*')
        .limit(100);

      const activeCustomers = customers
        ? customers.filter(c => c.subscription_status === 'active').length
        : 0;

      return {
        recentFinancials: financialData,
        recentDecisions: decisions,
        activeCustomers: activeCustomers,
        totalCustomers: customers?.length || 0
      };
    } catch (error) {
      console.error('Context gathering error:', error);
      return {};
    }
  }

  /**
   * Get expertise context
   */
  async getExpertiseContext(userId) {
    try {
      const { data: expertise } = await this.supabase
        .from('expertise_metrics')
        .select('*')
        .eq('user_id', userId || 'default');

      return expertise || [];
    } catch (error) {
      console.error('Expertise context error:', error);
      return [];
    }
  }

  /**
   * Compare options
   */
  async compareRecommendationOptions(options, criteria = {}) {
    try {
      const comparison = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 2000,
        system: `Compare business options on multiple dimensions.
For each option, score on:
- Potential impact (0-10)
- Implementation effort (0-10, lower is better)
- Risk level (0-10, lower is better)
- Timeline to results (days)
- Cost required

Return as JSON with comparison matrix.`,
        messages: [
          {
            role: 'user',
            content: `Compare these options: ${JSON.stringify(options)}`
          }
        ]
      });

      const comparisonText = comparison.content[0].text;
      const parsed = JSON.parse(comparisonText);

      return {
        success: true,
        comparison: parsed
      };
    } catch (error) {
      console.error('Comparison error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Predict recommendation outcome
   */
  async predictOutcome(recommendation, timeframe = 30) {
    try {
      const prediction = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 1500,
        system: `Predict the likely outcome of a business recommendation.
Provide:
1. Best case scenario
2. Most likely scenario
3. Worst case scenario
4. Probability of each (%)
5. Key success factors
6. Key failure points

Return as JSON.`,
        messages: [
          {
            role: 'user',
            content: `Predict outcome for: ${recommendation} in ${timeframe} days`
          }
        ]
      });

      const predictionText = prediction.content[0].text;
      const parsed = JSON.parse(predictionText);

      return {
        success: true,
        prediction: parsed,
        timeframeInDays: timeframe
      };
    } catch (error) {
      console.error('Outcome prediction error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate actionable steps
   */
  async generateActionPlan(recommendation) {
    try {
      const actionPlan = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 1500,
        system: `Create a detailed, actionable implementation plan.
Include:
1. Step-by-step actions (in order)
2. Owner for each step
3. Timeline for each step
4. Success criteria
5. Checkpoints to verify
6. Rollback plan if needed

Return as JSON.`,
        messages: [
          {
            role: 'user',
            content: `Create action plan for: ${recommendation}`
          }
        ]
      });

      const planText = actionPlan.content[0].text;
      const parsed = JSON.parse(planText);

      return {
        success: true,
        actionPlan: parsed
      };
    } catch (error) {
      console.error('Action plan error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Risk assessment
   */
  async assessRisks(decision) {
    try {
      const assessment = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 1500,
        system: `Assess business risks comprehensively.
Identify:
1. Financial risks
2. Operational risks
3. Market/competitive risks
4. Customer risks
5. Execution risks

For each risk:
- Probability (low/medium/high)
- Impact if occurs (low/medium/high)
- Mitigation strategy

Return as JSON.`,
        messages: [
          {
            role: 'user',
            content: `Assess risks for: ${decision}`
          }
        ]
      });

      const assessmentText = assessment.content[0].text;
      const parsed = JSON.parse(assessmentText);

      return {
        success: true,
        riskAssessment: parsed
      };
    } catch (error) {
      console.error('Risk assessment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate alternatives
   */
  async generateAlternatives(decision, count = 3) {
    try {
      const alternatives = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 1500,
        system: `Generate creative alternative approaches to a business decision.
For each alternative:
- Description
- Pros
- Cons
- When to use it
- Resource requirements

Return as JSON array.`,
        messages: [
          {
            role: 'user',
            content: `Generate ${count} alternatives to: ${decision}`
          }
        ]
      });

      const alternativesText = alternatives.content[0].text;
      const parsed = JSON.parse(alternativesText);

      return {
        success: true,
        alternatives: parsed
      };
    } catch (error) {
      console.error('Alternatives generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Personalized recommendation based on Finn's learning
   */
  async generatePersonalizedRecommendation(query, userId) {
    try {
      // Get user's past decisions and approvals
      const { data: pastDecisions } = await this.supabase
        .from('decisions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Get user's expertise
      const { data: expertise } = await this.supabase
        .from('expertise_metrics')
        .select('*')
        .eq('user_id', userId || 'default');

      // Analyze decision patterns
      const patterns = this.analyzeDecisionPatterns(pastDecisions);

      // Generate personalized recommendation
      const recommendation = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 2000,
        system: `You are Finn, recommending based on ${userId || 'user'}'s specific patterns.

Their decision patterns:
- Prefers: ${patterns.preferences || 'data-driven decisions'}
- Avoids: ${patterns.avoids || 'high-risk options'}
- Decision style: ${patterns.style || 'balanced approach'}
- Expertise: ${JSON.stringify(expertise)}

Tailor your recommendation to their style.`,
        messages: [
          {
            role: 'user',
            content: query
          }
        ]
      });

      const recommendationText = recommendation.content[0].text;
      const parsed = JSON.parse(recommendationText);

      return {
        success: true,
        recommendation: parsed,
        personalized: true
      };
    } catch (error) {
      console.error('Personalized recommendation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Analyze decision patterns
   */
  analyzeDecisionPatterns(decisions) {
    if (!decisions || decisions.length === 0) {
      return {};
    }

    const approved = decisions.filter(d => d.user_approval === 'approved');
    const rejected = decisions.filter(d => d.user_approval === 'rejected');

    const domains = {};
    approved.forEach(d => {
      domains[d.domain] = (domains[d.domain] || 0) + 1;
    });

    return {
      approvalRate: `${Math.round((approved.length / decisions.length) * 100)}%`,
      preferredDomains: Object.keys(domains),
      preferences: 'Strategic and financial decisions',
      avoids: 'Overly risky options',
      style: 'Data-driven with consideration for opportunities'
    };
  }
}

module.exports = EnhancedRecommendationEngine;
