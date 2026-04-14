/**
 * FINN KNOWLEDGE GRAPH SYSTEM
 * Concept Relationship Management
 * 
 * Builds and maintains a knowledge graph of business concepts
 * and their relationships for intelligent reasoning
 */

class KnowledgeGraph {
  constructor() {
    this.concepts = new Map();
    this.relationships = new Map();
    this.domains = new Set();
  }

  /**
   * Add concept to graph
   */
  addConcept(conceptId, data) {
    this.concepts.set(conceptId, {
      id: conceptId,
      name: data.name,
      description: data.description,
      domain: data.domain,
      importance: data.importance,
      addedAt: new Date(),
      relatedConcepts: new Set(),
      incomingRelationships: new Set(),
      outgoingRelationships: new Set()
    });

    this.domains.add(data.domain);
  }

  /**
   * Create relationship between concepts
   */
  createRelationship(sourceId, targetId, relationshipType, strength = 'medium') {
    const relId = `${sourceId}-${targetId}-${relationshipType}`;

    this.relationships.set(relId, {
      id: relId,
      source: sourceId,
      target: targetId,
      type: relationshipType,
      strength: strength,
      createdAt: new Date()
    });

    // Update concept references
    if (this.concepts.has(sourceId)) {
      this.concepts.get(sourceId).outgoingRelationships.add(relId);
      this.concepts.get(sourceId).relatedConcepts.add(targetId);
    }

    if (this.concepts.has(targetId)) {
      this.concepts.get(targetId).incomingRelationships.add(relId);
    }
  }

  /**
   * Find related concepts (one hop)
   */
  findRelatedConcepts(conceptId, depth = 1) {
    const related = new Set();
    const visited = new Set();

    const traverse = (id, currentDepth) => {
      if (currentDepth === 0 || visited.has(id)) return;

      visited.add(id);
      const concept = this.concepts.get(id);

      if (concept) {
        concept.relatedConcepts.forEach(relatedId => {
          related.add(relatedId);
          if (currentDepth > 1) {
            traverse(relatedId, currentDepth - 1);
          }
        });
      }
    };

    traverse(conceptId, depth);
    return Array.from(related)
      .map(id => this.concepts.get(id))
      .filter(c => c !== undefined);
  }

  /**
   * Get concept influence (how many other concepts depend on it)
   */
  getConceptInfluence(conceptId) {
    const concept = this.concepts.get(conceptId);
    if (!concept) return 0;

    return concept.outgoingRelationships.size +
           concept.incomingRelationships.size;
  }

  /**
   * Find knowledge paths between two concepts
   * How are two concepts related?
   */
  findKnowledgePath(startId, endId, maxDepth = 3) {
    const visited = new Set();
    const paths = [];

    const explore = (currentId, path, depth) => {
      if (depth === 0 || visited.has(currentId)) return;

      if (currentId === endId) {
        paths.push(path);
        return;
      }

      visited.add(currentId);
      const concept = this.concepts.get(currentId);

      if (concept) {
        concept.relatedConcepts.forEach(nextId => {
          if (!path.includes(nextId)) {
            explore(nextId, [...path, nextId], depth - 1);
          }
        });
      }

      visited.delete(currentId);
    };

    explore(startId, [startId], maxDepth);
    return paths;
  }

  /**
   * Get domain knowledge map
   * Show all concepts and relationships in a domain
   */
  getDomainKnowledgeMap(domain) {
    const domainConcepts = Array.from(this.concepts.values()).filter(
      c => c.domain === domain
    );

    const domainRelationships = Array.from(this.relationships.values()).filter(
      r => {
        const source = this.concepts.get(r.source);
        return source && source.domain === domain;
      }
    );

    return {
      domain: domain,
      conceptCount: domainConcepts.length,
      concepts: domainConcepts,
      relationships: domainRelationships,
      criticalConcepts: this.identifyCriticalConcepts(domainConcepts)
    };
  }

  /**
   * Identify critical/foundational concepts
   * High influence concepts that affect many others
   */
  identifyCriticalConcepts(concepts) {
    return concepts
      .map(c => ({
        ...c,
        influence: this.getConceptInfluence(c.id)
      }))
      .sort((a, b) => b.influence - a.influence)
      .slice(0, 5);
  }

  /**
   * Identify knowledge gaps in domain
   */
  identifyDomainGaps(domain) {
    const domainConcepts = Array.from(this.concepts.values()).filter(
      c => c.domain === domain
    );

    const isolated = domainConcepts.filter(
      c => c.relatedConcepts.size === 0 && c.incomingRelationships.size === 0
    );

    const weaklyConnected = domainConcepts.filter(
      c => c.relatedConcepts.size <= 2
    );

    return {
      domain: domain,
      isolatedConcepts: isolated,
      weaklyConnected: weaklyConnected,
      recommendation:
        isolated.length > 0
          ? `Connect ${isolated.length} isolated concepts to the graph`
          : 'Knowledge graph is well-connected'
    };
  }

  /**
   * Get learning path
   * Suggested learning sequence for domain
   */
  getLearningPath(domain) {
    const domainConcepts = Array.from(this.concepts.values()).filter(
      c => c.domain === domain
    );

    // Sort by importance and dependency
    return domainConcepts
      .sort((a, b) => {
        const importanceMap = { critical: 3, high: 2, medium: 1, low: 0 };
        const aImportance = importanceMap[a.importance] || 0;
        const bImportance = importanceMap[b.importance] || 0;

        if (aImportance !== bImportance) {
          return bImportance - aImportance;
        }

        // Secondary sort by influence
        return this.getConceptInfluence(b.id) -
               this.getConceptInfluence(a.id);
      })
      .map((c, index) => ({
        step: index + 1,
        concept: c.name,
        description: c.description,
        importance: c.importance,
        relatedTo: Array.from(c.relatedConcepts).length,
        estimatedLearningTime: this.estimateLearningTime(c)
      }));
  }

  /**
   * Estimate learning time for concept
   */
  estimateLearningTime(concept) {
    const importanceMap = { critical: 120, high: 90, medium: 60, low: 30 };
    const complexity = this.getConceptInfluence(concept.id);
    const baseTime = importanceMap[concept.importance] || 60;
    const complexityBonus = complexity * 15;

    return {
      minutes: baseTime + complexityBonus,
      readableTime:
        baseTime + complexityBonus > 120
          ? `${Math.round((baseTime + complexityBonus) / 60)} hours`
          : `${baseTime + complexityBonus} minutes`
    };
  }

  /**
   * Get concept metrics
   */
  getConceptMetrics(conceptId) {
    const concept = this.concepts.get(conceptId);
    if (!concept) return null;

    const outgoing = Array.from(concept.outgoingRelationships);
    const incoming = Array.from(concept.incomingRelationships);

    return {
      concept: concept.name,
      domain: concept.domain,
      importance: concept.importance,
      addedDaysAgo: Math.floor(
        (new Date() - concept.addedAt) / (1000 * 60 * 60 * 24)
      ),
      influence: this.getConceptInfluence(conceptId),
      outgoingConnections: outgoing.length,
      incomingConnections: incoming.length,
      totalConnections: outgoing.length + incoming.length,
      connectedConcepts: Array.from(concept.relatedConcepts)
        .map(id => this.concepts.get(id)?.name)
        .filter(n => n !== undefined)
    };
  }

  /**
   * Export graph as JSON
   */
  exportAsJSON() {
    return {
      concepts: Array.from(this.concepts.values()).map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        domain: c.domain,
        importance: c.importance,
        addedAt: c.addedAt
      })),
      relationships: Array.from(this.relationships.values()),
      domains: Array.from(this.domains),
      stats: {
        totalConcepts: this.concepts.size,
        totalRelationships: this.relationships.size,
        totalDomains: this.domains.size
      }
    };
  }

  /**
   * Get graph statistics
   */
  getGraphStatistics() {
    const concepts = Array.from(this.concepts.values());
    const influences = concepts.map(c => this.getConceptInfluence(c.id));

    return {
      totalConcepts: this.concepts.size,
      totalRelationships: this.relationships.size,
      totalDomains: this.domains.size,
      domainBreakdown: Object.fromEntries(
        Array.from(this.domains).map(d => [
          d,
          concepts.filter(c => c.domain === d).length
        ])
      ),
      averageInfluence: influences.length > 0
        ? Math.round(influences.reduce((a, b) => a + b, 0) / influences.length)
        : 0,
      mostInfluentialConcepts: concepts
        .sort((a, b) => this.getConceptInfluence(b.id) - this.getConceptInfluence(a.id))
        .slice(0, 5)
        .map(c => ({
          name: c.name,
          influence: this.getConceptInfluence(c.id)
        }))
    };
  }
}

module.exports = KnowledgeGraph;
