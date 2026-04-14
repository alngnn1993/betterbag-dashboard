/**
 * FINN ADVANCED LEARNING SYNTHESIS
 * Context-Based Knowledge Synthesis
 * 
 * Purpose: Synthesize learning from multiple sources into coherent knowledge
 * - Cross-domain concept connections
 * - Context synthesis
 * - Meta-learning (learning how to learn)
 * - Knowledge refinement
 */

const Anthropic = require('@anthropic-ai/sdk');

class AdvancedLearningSynthesis {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
    this.anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY
    });
  }

  /**
   * Synthesize concepts across domains
   */
  async synthesizeCrossDomainLearning(userId) {
    try {
      // Get all concepts for user across all domains
      const { data: concepts } = await this.supabase
        .from('concepts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!concepts || concepts.length === 0) {
        return { synthesis: null, insights: [] };
      }

      // Group by domain
      const conceptsByDomain = {};
      concepts.forEach(c => {
        if (!conceptsByDomain[c.category]) {
          conceptsByDomain[c.category] = [];
        }
        conceptsByDomain[c.category].push(c.name);
      });

      // Use Claude to synthesize cross-domain insights
      const synthesis = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 2000,
        system: `You are Finn's synthesis engine. Analyze how concepts across different business domains connect and reinforce each other.
Identify meta-patterns that apply across domains.
Look for strategic connections between financial, marketing, operational, and strategic concepts.
Return insights as JSON.`,
        messages: [
          {
            role: 'user',
            content: `Synthesize these concepts across domains: ${JSON.stringify(conceptsByDomain)}`
          }
        ]
      });

      const synthesisText = synthesis.content[0].text;
      const synthesisInsights = JSON.parse(synthesisText);

      return {
        synthesis: synthesisInsights,
        domainCount: Object.keys(conceptsByDomain).length,
        conceptCount: concepts.length
      };
    } catch (error) {
      console.error('Cross-domain synthesis error:', error);
      return { synthesis: null, insights: [] };
    }
  }

  /**
   * Generate learning summary with synthesis
   */
  async generateSynthesizedLearningSummary(conversationId) {
    try {
      // Get conversation
      const { data: messages } = await this.supabase
        .from('conversation_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      // Get concepts learned
      const { data: concepts } = await this.supabase
        .from('concepts')
        .select('*')
        .eq('conversation_id', conversationId);

      if (!messages || messages.length === 0) {
        return null;
      }

      // Build conversation narrative
      const conversationText = messages
        .map(m => `${m.role}: ${m.content}`)
        .join('\n\n');

      // Use Claude to synthesize the conversation
      const summary = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 1500,
        system: `You are Finn's synthesis engine. Analyze this conversation to extract:
1. Key learning themes
2. Strategic insights
3. Actionable implications
4. Knowledge gaps identified
5. Next learning priorities

Return as JSON with these fields.`,
        messages: [
          {
            role: 'user',
            content: `Synthesize learning from conversation:\n\n${conversationText}`
          }
        ]
      });

      const summaryText = summary.content[0].text;
      const synthesizedSummary = JSON.parse(summaryText);

      return {
        conversationId: conversationId,
        messageCount: messages.length,
        conceptCount: concepts?.length || 0,
        synthesis: synthesizedSummary,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Synthesis error:', error);
      return null;
    }
  }

  /**
   * Meta-learning: Learn how to learn better
   */
  async analyzeLearningPatterns(userId) {
    try {
      // Get all conversations
      const { data: conversations } = await this.supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!conversations || conversations.length === 0) {
        return { patterns: [], recommendations: [] };
      }

      // Analyze learning patterns
      const patterns = {
        totalConversations: conversations.length,
        averageMessageCount:
          conversations.reduce((sum, c) => sum + (c.message_count || 0), 0) /
          conversations.length,
        averageExpertiseGain:
          conversations.reduce((sum, c) => sum + (c.expertise_gain || 0), 0) /
          conversations.length,
        mostProductiveTime: this.findMostProductiveTime(conversations),
        learningTrend: this.calculateLearningTrend(conversations)
      };

      // Generate recommendations
      const recommendations = this.generateMetaLearningRecommendations(patterns);

      return {
        patterns: patterns,
        recommendations: recommendations
      };
    } catch (error) {
      console.error('Meta-learning analysis error:', error);
      return { patterns: {}, recommendations: [] };
    }
  }

  /**
   * Find most productive time of day for learning
   */
  findMostProductiveTime(conversations) {
    const hours = {};

    conversations.forEach(c => {
      const hour = new Date(c.created_at).getHours();
      hours[hour] = (hours[hour] || 0) + (c.expertise_gain || 0);
    });

    const mostProductive = Object.entries(hours).sort((a, b) => b[1] - a[1])[0];

    return mostProductive
      ? `${mostProductive[0]}:00 (gain: ${mostProductive[1]})`
      : 'Unknown';
  }

  /**
   * Calculate learning trend
   */
  calculateLearningTrend(conversations) {
    const gains = conversations.map(c => c.expertise_gain || 0).slice(0, 10);

    if (gains.length < 2) return 'insufficient_data';

    const recentAvg = gains.slice(0, 5).reduce((a, b) => a + b) / 5;
    const olderAvg = gains.slice(5).reduce((a, b) => a + b) / gains.slice(5).length;

    if (recentAvg > olderAvg * 1.2) return 'accelerating';
    if (recentAvg < olderAvg * 0.8) return 'decelerating';
    return 'steady';
  }

  /**
   * Generate meta-learning recommendations
   */
  generateMetaLearningRecommendations(patterns) {
    const recommendations = [];

    if (patterns.averageMessageCount < 5) {
      recommendations.push({
        type: 'conversation_depth',
        suggestion: 'Engage in deeper conversations (more messages per session)',
        rationale: 'Longer discussions lead to deeper understanding'
      });
    }

    if (patterns.learningTrend === 'decelerating') {
      recommendations.push({
        type: 'learning_pace',
        suggestion: 'Increase learning frequency',
        rationale: 'Learning velocity is decreasing - more consistent engagement helps'
      });
    }

    recommendations.push({
      type: 'optimal_time',
      suggestion: `Schedule learning sessions around ${patterns.mostProductiveTime}`,
      rationale: 'Your most productive learning happens at this time'
    });

    return recommendations;
  }

  /**
   * Identify conceptual bridges between domains
   */
  async findConceptualBridges() {
    try {
      // Get diverse concepts
      const { data: concepts } = await this.supabase
        .from('concepts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!concepts || concepts.length < 2) {
        return [];
      }

      // Use Claude to find bridges
      const bridges = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 1500,
        system: `Find conceptual bridges between business concepts from different domains.
Identify how a concept in one domain directly applies to another.
Return as JSON array of bridges with source, target, and connection.`,
        messages: [
          {
            role: 'user',
            content: `Find bridges between: ${concepts.map(c => `${c.name} (${c.category})`).join(', ')}`
          }
        ]
      });

      const bridgesText = bridges.content[0].text;
      const conceptBridges = JSON.parse(bridgesText);

      return conceptBridges;
    } catch (error) {
      console.error('Conceptual bridges error:', error);
      return [];
    }
  }

  /**
   * Generate strategic synthesis
   */
  async generateStrategicSynthesis(conversationHistory) {
    try {
      const synthesis = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 2000,
        system: `You are Finn's strategic synthesis engine.
Analyze the conversation history to generate:
1. Strategic implications
2. Competitive advantages
3. Risk factors
4. Growth opportunities
5. Recommended actions

Focus on actionable insights for BetterBag.`,
        messages: [
          {
            role: 'user',
            content: `Generate strategic synthesis from: ${conversationHistory}`
          }
        ]
      });

      const synthesisText = synthesis.content[0].text;
      const strategicInsights = JSON.parse(synthesisText);

      return strategicInsights;
    } catch (error) {
      console.error('Strategic synthesis error:', error);
      return {};
    }
  }

  /**
   * Synthesize decisions and outcomes
   */
  async synthesizeDecisionOutcomes(userId) {
    try {
      // Get decisions
      const { data: decisions } = await this.supabase
        .from('decisions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (!decisions || decisions.length === 0) {
        return { synthesis: null, patterns: [] };
      }

      // Analyze decision patterns
      const approved = decisions.filter(d => d.user_approval === 'approved');
      const rejected = decisions.filter(d => d.user_approval === 'rejected');

      const patterns = [
        {
          domain: 'approval_rate',
          value: `${Math.round((approved.length / decisions.length) * 100)}%`
        },
        {
          domain: 'most_approved',
          value: this.findMostApprovedDomain(approved)
        },
        {
          domain: 'average_impact',
          value: this.calculateAverageImpact(decisions)
        }
      ];

      return {
        synthesis: {
          totalDecisions: decisions.length,
          approved: approved.length,
          rejected: rejected.length,
          patterns: patterns
        },
        patterns: patterns
      };
    } catch (error) {
      console.error('Decision synthesis error:', error);
      return { synthesis: null, patterns: [] };
    }
  }

  /**
   * Find most approved domain
   */
  findMostApprovedDomain(decisions) {
    const domains = {};

    decisions.forEach(d => {
      domains[d.domain] = (domains[d.domain] || 0) + 1;
    });

    const top = Object.entries(domains).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : 'unknown';
  }

  /**
   * Calculate average decision impact
   */
  calculateAverageImpact(decisions) {
    const impacts = decisions
      .filter(d => d.result_impact)
      .map(d => d.result_impact);

    if (impacts.length === 0) return 0;

    return (impacts.reduce((a, b) => a + b) / impacts.length).toFixed(2);
  }
}

module.exports = AdvancedLearningSynthesis;
