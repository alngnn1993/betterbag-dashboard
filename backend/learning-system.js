/**
 * FINN LEARNING INTELLIGENCE SYSTEM
 * Core Learning Engine
 * 
 * Purpose: Extract knowledge from conversations and build expertise
 * - Concept extraction
 * - Knowledge synthesis
 * - Expertise calculation
 * - Domain-specific learning tracking
 */

const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

class FinnLearningSystem {
  constructor(supabaseUrl, supabaseKey, claudeApiKey) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.anthropic = new Anthropic({ apiKey: claudeApiKey });
    this.domains = [
      'finance',
      'marketing',
      'operations',
      'customer_success',
      'product',
      'strategy',
      'pricing',
      'growth'
    ];
  }

  /**
   * Extract concepts from user message using Claude
   * Identifies key business concepts and their relationships
   */
  async extractConceptsFromMessage(conversationId, message) {
    try {
      const extraction = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 1000,
        system: `You are Finn's concept extraction engine. Extract key business concepts from the message.
Return a JSON array with this structure:
[
  {
    "name": "concept name",
    "description": "brief description",
    "domain": "finance|marketing|operations|customer_success|product|strategy|pricing|growth",
    "importance": "critical|high|medium|low",
    "relatedConcepts": ["related concept 1", "related concept 2"]
  }
]

Focus on:
- Financial metrics (CAC, LTV, MRR, margins)
- Business strategies (pricing, growth tactics)
- Customer insights
- Operational processes
- Market positioning
- Product decisions`,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      });

      const responseText = extraction.content[0].text;
      const concepts = JSON.parse(responseText);

      // Store concepts in database
      for (const concept of concepts) {
        await this.supabase
          .from('concepts')
          .insert([
            {
              conversation_id: conversationId,
              name: concept.name,
              description: concept.description,
              category: concept.domain,
              importance: concept.importance,
              created_at: new Date().toISOString()
            }
          ]);
      }

      return concepts;
    } catch (error) {
      console.error('Error extracting concepts:', error);
      return [];
    }
  }

  /**
   * Calculate expertise level for each domain
   * Based on concepts learned and decisions observed
   */
  async calculateExpertiseLevel(userId) {
    try {
      const domainExpertise = {};

      for (const domain of this.domains) {
        // Count concepts in this domain
        const { data: concepts, count: conceptCount } = await this.supabase
          .from('concepts')
          .select('*', { count: 'exact' })
          .eq('category', domain);

        // Get conversations with decisions in this domain
        const { data: decisions, count: decisionCount } = await this.supabase
          .from('decisions')
          .select('*', { count: 'exact' })
          .eq('domain', domain);

        // Calculate expertise (0-100 scale)
        const conceptScore = Math.min(conceptCount * 2, 50);
        const decisionScore = Math.min(decisionCount * 1, 50);
        const expertiseLevel = (conceptScore + decisionScore) / 100;

        domainExpertise[domain] = {
          level: Math.min(expertiseLevel * 100, 100),
          conceptsLearned: conceptCount || 0,
          decisionsObserved: decisionCount || 0,
          confidenceScore: Math.min(expertiseLevel * 100, 100)
        };
      }

      return domainExpertise;
    } catch (error) {
      console.error('Error calculating expertise:', error);
      return {};
    }
  }

  /**
   * Build knowledge graph connections between concepts
   * Shows how concepts relate to each other
   */
  async buildKnowledgeGraph(conversationId) {
    try {
      // Get all concepts from this conversation
      const { data: concepts } = await this.supabase
        .from('concepts')
        .select('*')
        .eq('conversation_id', conversationId);

      if (!concepts || concepts.length === 0) {
        return {};
      }

      // Use Claude to identify relationships
      const conceptNames = concepts.map(c => c.name).join(', ');

      const relationshipAnalysis = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 1500,
        system: `You are analyzing relationships between business concepts.
Return a JSON object showing how concepts relate:
{
  "relationships": [
    {
      "source": "concept 1",
      "target": "concept 2",
      "relationship": "type of relationship",
      "strength": "strong|medium|weak",
      "description": "how they relate"
    }
  ]
}`,
        messages: [
          {
            role: 'user',
            content: `Analyze relationships between these concepts: ${conceptNames}`
          }
        ]
      });

      const relationshipText = relationshipAnalysis.content[0].text;
      const relationships = JSON.parse(relationshipText);

      return {
        concepts: concepts,
        relationships: relationships.relationships
      };
    } catch (error) {
      console.error('Error building knowledge graph:', error);
      return {};
    }
  }

  /**
   * Generate learning summary for a conversation
   * What did Finn learn? What gaps remain?
   */
  async generateLearningSummary(conversationId) {
    try {
      // Get conversation messages
      const { data: messages } = await this.supabase
        .from('conversation_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!messages || messages.length === 0) {
        return null;
      }

      // Get concepts learned
      const { data: concepts } = await this.supabase
        .from('concepts')
        .select('*')
        .eq('conversation_id', conversationId);

      // Use Claude to summarize learning
      const conversationText = messages
        .map(m => `${m.role}: ${m.content}`)
        .join('\n\n');

      const summary = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 1000,
        system: `You are Finn's learning summary engine. Analyze what was learned in this conversation.
Return a JSON object:
{
  "keyLearnings": ["learning 1", "learning 2", ...],
  "domainsImproved": ["domain1", "domain2", ...],
  "knowledgeGaps": ["gap1", "gap2", ...],
  "recommendations": ["what to learn next"],
  "readinessScore": 0-100
}`,
        messages: [
          {
            role: 'user',
            content: `Summarize learning from this conversation:\n\n${conversationText}`
          }
        ]
      });

      const summaryText = summary.content[0].text;
      const learningSummary = JSON.parse(summaryText);

      return {
        conversationId: conversationId,
        summary: learningSummary,
        conceptsCount: concepts.length,
        messagesCount: messages.length,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating learning summary:', error);
      return null;
    }
  }

  /**
   * Identify knowledge gaps
   * What does Finn still need to learn?
   */
  async identifyKnowledgeGaps(userId) {
    try {
      const expertise = await this.calculateExpertiseLevel(userId);

      const gaps = {
        critical: [],
        high: [],
        medium: []
      };

      // Domains with low expertise are gaps
      for (const [domain, data] of Object.entries(expertise)) {
        if (data.level < 30) {
          gaps.critical.push({
            domain: domain,
            currentLevel: data.level,
            conceptsNeeded: 10 - data.conceptsLearned
          });
        } else if (data.level < 60) {
          gaps.high.push({
            domain: domain,
            currentLevel: data.level,
            conceptsNeeded: 5 - Math.floor(data.conceptsLearned / 2)
          });
        } else if (data.level < 85) {
          gaps.medium.push({
            domain: domain,
            currentLevel: data.level,
            conceptsNeeded: 2
          });
        }
      }

      return gaps;
    } catch (error) {
      console.error('Error identifying knowledge gaps:', error);
      return { critical: [], high: [], medium: [] };
    }
  }

  /**
   * Generate questions Finn should ask to deepen learning
   */
  async generateClarifyingQuestions(conversationId) {
    try {
      const { data: messages } = await this.supabase
        .from('conversation_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!messages || messages.length < 2) {
        return [];
      }

      const lastUserMessage = messages
        .reverse()
        .find(m => m.role === 'user');

      if (!lastUserMessage) {
        return [];
      }

      const questions = await this.anthropic.messages.create({
        model: 'claude-opus-4-20250514',
        max_tokens: 500,
        system: `You are Finn's question generator. Generate clarifying questions to deepen understanding.
Return a JSON array:
[
  {
    "question": "question to ask",
    "domain": "relevant domain",
    "importance": "critical|high|medium",
    "reason": "why this matters"
  }
]

Generate 2-3 insightful questions that would help understand the topic better.`,
        messages: [
          {
            role: 'user',
            content: `Based on this message, what clarifying questions should Finn ask?\n\n"${lastUserMessage.content}"`
          }
        ]
      });

      const questionsText = questions.content[0].text;
      const clarifyingQuestions = JSON.parse(questionsText);

      return clarifyingQuestions;
    } catch (error) {
      console.error('Error generating questions:', error);
      return [];
    }
  }

  /**
   * Update expertise metrics after learning
   */
  async updateExpertiseMetrics(userId) {
    try {
      const expertise = await this.calculateExpertiseLevel(userId);

      for (const [domain, data] of Object.entries(expertise)) {
        const { data: existing } = await this.supabase
          .from('expertise_metrics')
          .select('*')
          .eq('user_id', userId)
          .eq('domain', domain)
          .single();

        if (existing) {
          // Update existing record
          await this.supabase
            .from('expertise_metrics')
            .update({
              expertise_level: data.level,
              confidence_score: data.confidenceScore,
              concepts_learned: data.conceptsLearned,
              decisions_observed: data.decisionsObserved,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);
        } else {
          // Create new record
          await this.supabase
            .from('expertise_metrics')
            .insert([
              {
                user_id: userId,
                domain: domain,
                expertise_level: data.level,
                confidence_score: data.confidenceScore,
                concepts_learned: data.conceptsLearned,
                decisions_observed: data.decisionsObserved,
                updated_at: new Date().toISOString()
              }
            ]);
        }
      }

      return expertise;
    } catch (error) {
      console.error('Error updating expertise metrics:', error);
      return {};
    }
  }
}

module.exports = FinnLearningSystem;
