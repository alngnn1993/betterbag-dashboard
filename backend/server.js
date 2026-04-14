/**
 * FINN - AI CEO System
 * Core Backend Server
 * 
 * Purpose: Main Express server that handles all Finn operations
 * - Conversation management with Claude API
 * - Learning system integration
 * - Knowledge management
 * - Database operations
 * - Security & encryption
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const Anthropic = require('@anthropic-ai/sdk');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize clients
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

// ============================================
// CONVERSATION MANAGEMENT
// ============================================

/**
 * Handles multi-turn conversations with Finn
 * Stores conversation history for learning
 * Extracts concepts and updates expertise
 */
app.post('/api/conversations/start', async (req, res) => {
  try {
    const { userId, initialMessage } = req.body;

    if (!userId || !initialMessage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create conversation record in database
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert([
        {
          user_id: userId,
          status: 'active',
          message_count: 0,
          expertise_gain: 0,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (convError) throw convError;

    // Store initial message
    const { data: message, error: msgError } = await supabase
      .from('conversation_messages')
      .insert([
        {
          conversation_id: conversation.id,
          role: 'user',
          content: initialMessage,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (msgError) throw msgError;

    // Get Finn's response
    const finnResponse = await anthropic.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1024,
      system: `You are Finn, an AI CEO assistant for BetterBag (takeout bag subscription business).
Your role is to learn about the business deeply through conversations.
Ask clarifying questions. Understand context. Learn preferences.
Be conversational, intelligent, and genuinely interested in understanding the business.`,
      messages: [
        {
          role: 'user',
          content: initialMessage
        }
      ]
    });

    const assistantMessage = finnResponse.content[0].text;

    // Store Finn's response
    const { data: finnMsg } = await supabase
      .from('conversation_messages')
      .insert([
        {
          conversation_id: conversation.id,
          role: 'assistant',
          content: assistantMessage,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    // Extract and store concepts (learning)
    await extractAndStoreConepts(conversation.id, initialMessage);

    res.json({
      success: true,
      conversation_id: conversation.id,
      finn_response: assistantMessage
    });

  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Continue a conversation with Finn
 */
app.post('/api/conversations/:conversationId/message', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message required' });
    }

    // Store user message
    const { data: userMsg } = await supabase
      .from('conversation_messages')
      .insert([
        {
          conversation_id: conversationId,
          role: 'user',
          content: userMessage,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    // Get conversation history
    const { data: messages } = await supabase
      .from('conversation_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    // Build message array for Claude
    const claudeMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Get Finn's response
    const finnResponse = await anthropic.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1024,
      system: `You are Finn, an AI CEO assistant for BetterBag.
You are learning deeply about this business through conversations.
Ask insightful questions. Provide thoughtful responses.
Remember what you've learned from previous messages.
Be strategic, intelligent, and genuinely interested in success.`,
      messages: claudeMessages
    });

    const assistantMessage = finnResponse.content[0].text;

    // Store Finn's response
    const { data: finnMsg } = await supabase
      .from('conversation_messages')
      .insert([
        {
          conversation_id: conversationId,
          role: 'assistant',
          content: assistantMessage,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    // Extract concepts and update learning
    await extractAndStoreConepts(conversationId, userMessage);
    await updateExpertiseLevel(conversationId);

    res.json({
      success: true,
      finn_response: assistantMessage,
      message_id: finnMsg.id
    });

  } catch (error) {
    console.error('Error in conversation:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// LEARNING SYSTEM
// ============================================

/**
 * Extract concepts from messages and store for knowledge base
 */
async function extractAndStoreConepts(conversationId, message) {
  try {
    const { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (!conversation) return;

    // Extract concepts using Claude
    const extraction = await anthropic.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 500,
      system: `Extract key concepts and business insights from this message.
Return as JSON array of concepts with brief descriptions.
Focus on actionable business knowledge.`,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    const concepts = JSON.parse(extraction.content[0].text);

    // Store concepts
    for (const concept of concepts) {
      await supabase
        .from('concepts')
        .insert([
          {
            conversation_id: conversationId,
            name: concept.name,
            description: concept.description,
            category: concept.category || 'general',
            importance: concept.importance || 'medium',
            created_at: new Date().toISOString()
          }
        ]);
    }

  } catch (error) {
    console.error('Error extracting concepts:', error);
    // Don't throw - learning is bonus, not critical
  }
}

/**
 * Update Finn's expertise level based on learning
 */
async function updateExpertiseLevel(conversationId) {
  try {
    // Get concept count
    const { data: concepts, count } = await supabase
      .from('concepts')
      .select('*', { count: 'exact' })
      .eq('conversation_id', conversationId);

    // Calculate expertise (simplified - would be more complex in production)
    const expertiseLevel = Math.min(100, count * 2);

    // Update conversation
    await supabase
      .from('conversations')
      .update({
        expertise_gain: expertiseLevel,
        updated_at: new Date().toISOString()
      })
      .eq('id', conversationId);

  } catch (error) {
    console.error('Error updating expertise:', error);
  }
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Finn AI CEO Backend'
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   FINN AI CEO SYSTEM - BACKEND LIVE    ║
║   Listening on port ${PORT}              ║
║   Ready to learn and serve BetterBag   ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
