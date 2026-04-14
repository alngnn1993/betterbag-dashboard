/**
 * FINN ADVANCED API ENDPOINTS
 * Recommendation Engine and Decision Management
 * 
 * API routes for generating recommendations and managing decisions
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/finn/expertise
 * Get Finn's expertise level by domain
 */
router.get('/expertise', async (req, res) => {
  try {
    const userId = req.user?.id || 'default';
    
    const { data: expertiseData } = await req.supabase
      .from('expertise_metrics')
      .select('*')
      .eq('user_id', userId);

    const expertise = {};
    expertiseData?.forEach(e => {
      expertise[e.domain] = {
        level: e.expertise_level,
        confidence: e.confidence_score,
        concepts: e.concepts_learned,
        decisions: e.decisions_observed
      };
    });

    const overallExpertise = expertiseData?.length > 0
      ? expertiseData.reduce((sum, e) => sum + e.expertise_level, 0) / expertiseData.length
      : 0;

    res.json({
      success: true,
      overallExpertise: Math.round(overallExpertise),
      byDomain: expertise,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting expertise:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/finn/recommend
 * Get a recommendation from Finn
 */
router.post('/recommend', async (req, res) => {
  try {
    const { query, context } = req.body;
    const userId = req.user?.id || 'default';

    if (!query) {
      return res.status(400).json({ error: 'Query required' });
    }

    // Get relevant context from conversations
    const { data: conversations } = await req.supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get Finn's expertise
    const { data: expertise } = await req.supabase
      .from('expertise_metrics')
      .select('*')
      .eq('user_id', userId);

    // Build system prompt with expertise context
    const expertiseContext = expertise?.length > 0
      ? `Current expertise: ${JSON.stringify(expertise)}`
      : 'Building initial expertise';

    const recommendation = await req.anthropic.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1500,
      system: `You are Finn, an AI CEO assistant for BetterBag.
${expertiseContext}

Provide strategic recommendations based on:
1. Business context provided
2. Your learned expertise
3. BetterBag's specific situation (takeout bag subscription business)
4. Historical conversations and decisions

Format your recommendation as:
{
  "recommendation": "your recommendation",
  "reasoning": "why this is recommended",
  "expectedOutcome": "likely result",
  "risks": ["risk 1", "risk 2"],
  "alternatives": ["alternative 1", "alternative 2"],
  "confidenceLevel": 0-100,
  "domains": ["domain1", "domain2"]
}`,
      messages: [
        {
          role: 'user',
          content: `Query: ${query}\n\nAdditional context: ${JSON.stringify(context || {})}`
        }
      ]
    });

    const recommendationText = recommendation.content[0].text;
    const parsed = JSON.parse(recommendationText);

    // Store decision in database
    const { data: decision } = await req.supabase
      .from('decisions')
      .insert([
        {
          decision_type: 'recommendation',
          domain: parsed.domains?.[0] || 'strategy',
          description: query,
          finn_recommendation: parsed.recommendation,
          user_approval: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    res.json({
      success: true,
      recommendation: parsed,
      decisionId: decision?.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating recommendation:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/finn/decision/:id/approve
 * Approve a decision recommendation
 */
router.post('/decision/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const { data: decision, error } = await req.supabase
      .from('decisions')
      .update({
        user_approval: 'approved',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log the approval for learning
    await req.supabase
      .from('audit_logs')
      .insert([
        {
          event_type: 'decision_approved',
          actor: 'user',
          details: { decision_id: id, feedback },
          timestamp: new Date().toISOString()
        }
      ]);

    res.json({
      success: true,
      decision: decision,
      message: 'Decision approved'
    });

  } catch (error) {
    console.error('Error approving decision:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/finn/decision/:id/reject
 * Reject a decision recommendation
 */
router.post('/decision/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const { data: decision, error } = await req.supabase
      .from('decisions')
      .update({
        user_approval: 'rejected',
        outcome: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Finn learns from rejection
    await req.supabase
      .from('audit_logs')
      .insert([
        {
          event_type: 'decision_rejected',
          actor: 'user',
          details: { decision_id: id, reason: reason },
          timestamp: new Date().toISOString()
        }
      ]);

    res.json({
      success: true,
      decision: decision,
      message: 'Decision rejected. Finn will learn from this feedback.'
    });

  } catch (error) {
    console.error('Error rejecting decision:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/finn/learning-summary
 * Get a summary of what Finn has learned
 */
router.get('/learning-summary', async (req, res) => {
  try {
    const userId = req.user?.id || 'default';

    // Get all concepts
    const { data: concepts } = await req.supabase
      .from('concepts')
      .select('*')
      .order('created_at', { ascending: false });

    // Get expertise
    const { data: expertise } = await req.supabase
      .from('expertise_metrics')
      .select('*')
      .eq('user_id', userId);

    // Group by domain
    const conceptsByDomain = {};
    concepts?.forEach(c => {
      if (!conceptsByDomain[c.category]) {
        conceptsByDomain[c.category] = [];
      }
      conceptsByDomain[c.category].push(c.name);
    });

    res.json({
      success: true,
      summary: {
        totalConceptsLearned: concepts?.length || 0,
        conceptsByDomain: conceptsByDomain,
        expertiseByDomain: expertise,
        lastUpdate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error getting learning summary:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/finn/insights
 * Get actionable insights from Finn
 */
router.get('/insights', async (req, res) => {
  try {
    const userId = req.user?.id || 'default';
    const { domain } = req.query;

    // Get recent decisions
    const { data: decisions } = await req.supabase
      .from('decisions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get concepts in domain
    const query = req.supabase
      .from('concepts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (domain) {
      query.eq('category', domain);
    }

    const { data: concepts } = await query;

    // Analyze patterns (simplified)
    const insights = {
      patterns: [],
      opportunities: [],
      risks: [],
      recommendations: []
    };

    // Look for patterns in decisions
    if (decisions?.length > 3) {
      insights.patterns.push({
        type: 'decision_frequency',
        description: `Making decisions in ${new Set(decisions.map(d => d.domain)).size} different domains`,
        insight: 'Strong cross-functional thinking'
      });
    }

    // Identify learning opportunities
    if (concepts?.length > 10) {
      insights.opportunities.push({
        type: 'learning_breadth',
        description: `Accumulated ${concepts.length} distinct concepts`,
        insight: 'Ready to deepen expertise in specific domains'
      });
    }

    res.json({
      success: true,
      insights: insights,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting insights:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/finn/growth-projection
 * Project Finn's expertise growth
 */
router.get('/growth-projection', async (req, res) => {
  try {
    const userId = req.user?.id || 'default';
    const { days = 30 } = req.query;

    const { data: expertise } = await req.supabase
      .from('expertise_metrics')
      .select('*')
      .eq('user_id', userId);

    const projections = {};

    expertise?.forEach(e => {
      // Simple linear projection
      const currentLevel = e.expertise_level;
      const conceptsLearned = e.concepts_learned || 1;
      const growthRate = Math.min(conceptsLearned / 20, 0.05); // 5% max daily growth
      const projectedLevel = Math.min(
        currentLevel + growthRate * days * 100,
        100
      );

      projections[e.domain] = {
        current: Math.round(currentLevel),
        projected: Math.round(projectedLevel),
        daysTo70: currentLevel < 70
          ? Math.ceil((70 - currentLevel) / (growthRate * 100))
          : 0,
        daysTo90: currentLevel < 90
          ? Math.ceil((90 - currentLevel) / (growthRate * 100))
          : 0
      };
    });

    res.json({
      success: true,
      projections: projections,
      timeframeInDays: parseInt(days),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error projecting growth:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
