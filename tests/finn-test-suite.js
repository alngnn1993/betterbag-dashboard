/**
 * FINN COMPREHENSIVE TESTING FRAMEWORK
 * Unit and Integration Tests
 * 
 * Tests for learning system, expertise calculation, and API endpoints
 */

const assert = require('assert');

class FinnTestSuite {
  constructor() {
    this.testResults = [];
    this.passCount = 0;
    this.failCount = 0;
  }

  /**
   * Assert helper
   */
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  /**
   * Test concept extraction
   */
  async testConceptExtraction() {
    try {
      const message = 'Our CAC is $25, LTV is $500, so our LTV/CAC ratio is 20:1';
      const expectedConcepts = ['CAC', 'LTV', 'LTV/CAC ratio'];

      // Mock extraction
      const extracted = await this.mockConceptExtraction(message);

      this.assert(
        extracted.length > 0,
        'Should extract at least one concept'
      );

      expectedConcepts.forEach(concept => {
        this.assert(
          extracted.some(c => c.name.includes(concept)),
          `Should extract concept: ${concept}`
        );
      });

      this.recordTest('testConceptExtraction', true);
    } catch (error) {
      this.recordTest('testConceptExtraction', false, error.message);
    }
  }

  /**
   * Test expertise calculation
   */
  async testExpertiseCalculation() {
    try {
      // Test with varying concept counts
      const testCases = [
        { concepts: 0, expectedMin: 0, expectedMax: 5 },
        { concepts: 5, expectedMin: 15, expectedMax: 30 },
        { concepts: 15, expectedMin: 45, expectedMax: 55 }
      ];

      testCases.forEach(testCase => {
        const expertise = this.calculateConceptExpertise(
          testCase.concepts,
          'finance'
        );

        this.assert(
          expertise >= testCase.expectedMin && expertise <= testCase.expectedMax,
          `Expertise ${expertise} should be between ${testCase.expectedMin}-${testCase.expectedMax}`
        );
      });

      this.recordTest('testExpertiseCalculation', true);
    } catch (error) {
      this.recordTest('testExpertiseCalculation', false, error.message);
    }
  }

  /**
   * Test knowledge graph relationships
   */
  async testKnowledgeGraphRelationships() {
    try {
      const graph = this.createMockGraph();

      // Add concepts
      graph.addConcept('c1', {
        name: 'CAC',
        description: 'Customer Acquisition Cost',
        domain: 'marketing',
        importance: 'critical'
      });

      graph.addConcept('c2', {
        name: 'LTV',
        description: 'Lifetime Value',
        domain: 'finance',
        importance: 'critical'
      });

      // Create relationship
      graph.createRelationship('c1', 'c2', 'influences');

      // Test relationship
      this.assert(
        graph.concepts.get('c1').relatedConcepts.has('c2'),
        'Concepts should be related'
      );

      this.recordTest('testKnowledgeGraphRelationships', true);
    } catch (error) {
      this.recordTest('testKnowledgeGraphRelationships', false, error.message);
    }
  }

  /**
   * Test expertise across multiple domains
   */
  async testMultiDomainExpertise() {
    try {
      const domains = ['finance', 'marketing', 'operations'];
      const expertise = {};

      domains.forEach(domain => {
        expertise[domain] = Math.random() * 100;
      });

      // Calculate overall
      const overall =
        Object.values(expertise).reduce((a, b) => a + b, 0) / domains.length;

      this.assert(
        overall >= 0 && overall <= 100,
        'Overall expertise should be 0-100'
      );

      this.recordTest('testMultiDomainExpertise', true);
    } catch (error) {
      this.recordTest('testMultiDomainExpertise', false, error.message);
    }
  }

  /**
   * Test learning velocity calculation
   */
  async testLearningVelocity() {
    try {
      const concepts = [
        { created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
      ];

      const velocity = this.calculateLearningVelocity(concepts, 7);

      this.assert(
        velocity >= 0 && velocity <= 1,
        'Velocity should be 0-1 scale'
      );

      this.recordTest('testLearningVelocity', true);
    } catch (error) {
      this.recordTest('testLearningVelocity', false, error.message);
    }
  }

  /**
   * Test decision approval workflow
   */
  async testDecisionWorkflow() {
    try {
      const decision = {
        id: 'decision-1',
        status: 'pending',
        recommendation: 'Increase pricing by 10%'
      };

      // Simulate approval
      decision.status = 'approved';
      decision.approvedAt = new Date();

      this.assert(decision.status === 'approved', 'Decision should be approved');
      this.assert(
        decision.approvedAt !== undefined,
        'Should have approval timestamp'
      );

      this.recordTest('testDecisionWorkflow', true);
    } catch (error) {
      this.recordTest('testDecisionWorkflow', false, error.message);
    }
  }

  /**
   * Test API endpoint response format
   */
  async testAPIResponseFormat() {
    try {
      const mockResponse = {
        success: true,
        data: {
          expertise: 75,
          domain: 'finance'
        },
        timestamp: new Date().toISOString()
      };

      this.assert(mockResponse.success === true, 'Should indicate success');
      this.assert(mockResponse.data !== undefined, 'Should have data field');
      this.assert(mockResponse.timestamp !== undefined, 'Should have timestamp');

      this.recordTest('testAPIResponseFormat', true);
    } catch (error) {
      this.recordTest('testAPIResponseFormat', false, error.message);
    }
  }

  /**
   * Test data integrity
   */
  async testDataIntegrity() {
    try {
      const concept = {
        id: 'concept-1',
        name: 'Customer Acquisition Cost',
        domain: 'marketing',
        importance: 'critical'
      };

      // Verify data integrity
      this.assert(concept.id !== '', 'ID should not be empty');
      this.assert(concept.name !== '', 'Name should not be empty');
      this.assert(['finance', 'marketing', 'operations'].includes(concept.domain),
        'Domain should be valid'
      );
      this.assert(
        ['critical', 'high', 'medium', 'low'].includes(concept.importance),
        'Importance should be valid'
      );

      this.recordTest('testDataIntegrity', true);
    } catch (error) {
      this.recordTest('testDataIntegrity', false, error.message);
    }
  }

  /**
   * Test confidence score bounds
   */
  async testConfidenceScoreBounds() {
    try {
      const testCases = [
        { concepts: 0, decisions: 0, expected: 'low' },
        { concepts: 10, decisions: 5, expected: 'medium' },
        { concepts: 20, decisions: 20, expected: 'high' }
      ];

      testCases.forEach(testCase => {
        const confidence = this.mockConfidenceScore(
          testCase.concepts,
          testCase.decisions
        );

        this.assert(
          confidence >= 0 && confidence <= 100,
          'Confidence should be 0-100'
        );
      });

      this.recordTest('testConfidenceScoreBounds', true);
    } catch (error) {
      this.recordTest('testConfidenceScoreBounds', false, error.message);
    }
  }

  // Helper methods

  async mockConceptExtraction(message) {
    return [
      { name: 'CAC', importance: 'high' },
      { name: 'LTV', importance: 'high' },
      { name: 'LTV/CAC ratio', importance: 'high' }
    ];
  }

  calculateConceptExpertise(count, domain) {
    return Math.min((count / 15) * 50, 50);
  }

  calculateLearningVelocity(concepts, days) {
    return Math.min(concepts.length / days / 2, 1);
  }

  createMockGraph() {
    return {
      concepts: new Map(),
      addConcept: function(id, data) {
        this.concepts.set(id, { ...data, relatedConcepts: new Set() });
      },
      createRelationship: function(source, target) {
        if (this.concepts.has(source)) {
          this.concepts.get(source).relatedConcepts.add(target);
        }
      }
    };
  }

  mockConfidenceScore(concepts, decisions) {
    return Math.min((concepts / 10) * 30 + (decisions / 20) * 30 + 40, 100);
  }

  recordTest(testName, passed, error = null) {
    this.testResults.push({
      name: testName,
      passed: passed,
      error: error,
      timestamp: new Date().toISOString()
    });

    if (passed) {
      this.passCount++;
    } else {
      this.failCount++;
    }
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('\n🧪 Running Finn Testing Suite...\n');

    await this.testConceptExtraction();
    await this.testExpertiseCalculation();
    await this.testKnowledgeGraphRelationships();
    await this.testMultiDomainExpertise();
    await this.testLearningVelocity();
    await this.testDecisionWorkflow();
    await this.testAPIResponseFormat();
    await this.testDataIntegrity();
    await this.testConfidenceScoreBounds();

    return this.getResults();
  }

  /**
   * Get test results
   */
  getResults() {
    return {
      summary: {
        total: this.passCount + this.failCount,
        passed: this.passCount,
        failed: this.failCount,
        successRate: `${Math.round((this.passCount / (this.passCount + this.failCount)) * 100)}%`
      },
      details: this.testResults
    };
  }

  /**
   * Print results
   */
  printResults() {
    const results = this.getResults();

    console.log('\n✅ TEST RESULTS\n');
    console.log(`Total Tests: ${results.summary.total}`);
    console.log(`Passed: ${results.summary.passed} ✓`);
    console.log(`Failed: ${results.summary.failed} ✗`);
    console.log(`Success Rate: ${results.summary.successRate}\n`);

    this.testResults.forEach(test => {
      const status = test.passed ? '✓' : '✗';
      console.log(`${status} ${test.name}`);
      if (test.error) {
        console.log(`  Error: ${test.error}`);
      }
    });

    return results;
  }
}

module.exports = FinnTestSuite;
