const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');

class CodingDashboardMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'coding-dashboard-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();
    this.setupPromptHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'execute_code',
            description: 'Execute code in various programming languages',
            inputSchema: {
              type: 'object',
              properties: {
                language: {
                  type: 'string',
                  enum: ['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'php', 'ruby'],
                  description: 'Programming language to execute'
                },
                code: {
                  type: 'string',
                  description: 'Code to execute'
                },
                input: {
                  type: 'string',
                  description: 'Input data for the program'
                }
              },
              required: ['language', 'code']
            }
          },
          {
            name: 'analyze_code',
            description: 'Analyze code for complexity, patterns, and suggestions',
            inputSchema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Code to analyze'
                },
                language: {
                  type: 'string',
                  description: 'Programming language of the code'
                }
              },
              required: ['code']
            }
          },
          {
            name: 'get_contest_problems',
            description: 'Fetch coding contest problems from various platforms',
            inputSchema: {
              type: 'object',
              properties: {
                platform: {
                  type: 'string',
                  enum: ['leetcode', 'codeforces', 'codechef'],
                  description: 'Contest platform'
                },
                difficulty: {
                  type: 'string',
                  enum: ['easy', 'medium', 'hard'],
                  description: 'Problem difficulty level'
                },
                limit: {
                  type: 'number',
                  description: 'Number of problems to fetch',
                  default: 10
                }
              },
              required: ['platform']
            }
          },
          {
            name: 'create_learning_path',
            description: 'Create a personalized learning path for coding skills',
            inputSchema: {
              type: 'object',
              properties: {
                skill_level: {
                  type: 'string',
                  enum: ['beginner', 'intermediate', 'advanced'],
                  description: 'Current skill level'
                },
                focus_areas: {
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['algorithms', 'data-structures', 'web-development', 'machine-learning', 'system-design']
                  },
                  description: 'Areas to focus on'
                },
                time_commitment: {
                  type: 'string',
                  enum: ['1-2 hours/day', '3-4 hours/day', '5+ hours/day'],
                  description: 'Time commitment per day'
                }
              },
              required: ['skill_level', 'focus_areas']
            }
          },
          {
            name: 'generate_code_template',
            description: 'Generate code templates for various algorithms and data structures',
            inputSchema: {
              type: 'object',
              properties: {
                template_type: {
                  type: 'string',
                  enum: ['binary-search', 'dfs', 'bfs', 'dynamic-programming', 'sorting', 'linked-list', 'tree'],
                  description: 'Type of template to generate'
                },
                language: {
                  type: 'string',
                  enum: ['javascript', 'python', 'java', 'cpp'],
                  description: 'Programming language for the template'
                }
              },
              required: ['template_type', 'language']
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'execute_code':
          return await this.executeCode(args);
        case 'analyze_code':
          return await this.analyzeCode(args);
        case 'get_contest_problems':
          return await this.getContestProblems(args);
        case 'create_learning_path':
          return await this.createLearningPath(args);
        case 'generate_code_template':
          return await this.generateCodeTemplate(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  setupResourceHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'file://user-progress',
            name: 'User Progress Data',
            description: 'User learning progress and statistics',
            mimeType: 'application/json'
          },
          {
            uri: 'file://coding-templates',
            name: 'Code Templates',
            description: 'Pre-built code templates for common algorithms',
            mimeType: 'text/plain'
          },
          {
            uri: 'file://contest-history',
            name: 'Contest History',
            description: 'Historical contest data and problems',
            mimeType: 'application/json'
          }
        ]
      };
    });

    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      switch (uri) {
        case 'file://user-progress':
          return await this.getUserProgress();
        case 'file://coding-templates':
          return await this.getCodingTemplates();
        case 'file://contest-history':
          return await this.getContestHistory();
        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });
  }

  setupPromptHandlers() {
    // List available prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [
          {
            name: 'code-review',
            description: 'Comprehensive code review with suggestions',
            arguments: [
              {
                name: 'code',
                description: 'Code to review',
                required: true
              },
              {
                name: 'language',
                description: 'Programming language',
                required: true
              }
            ]
          },
          {
            name: 'debug-help',
            description: 'Help debug code issues',
            arguments: [
              {
                name: 'code',
                description: 'Code with issues',
                required: true
              },
              {
                name: 'error',
                description: 'Error message or description',
                required: true
              }
            ]
          },
          {
            name: 'algorithm-explanation',
            description: 'Explain algorithms and provide implementation guidance',
            arguments: [
              {
                name: 'algorithm',
                description: 'Algorithm name or description',
                required: true
              },
              {
                name: 'language',
                description: 'Preferred programming language',
                required: false
              }
            ]
          }
        ]
      };
    });

    // Handle prompt requests
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'code-review':
          return await this.generateCodeReviewPrompt(args);
        case 'debug-help':
          return await this.generateDebugHelpPrompt(args);
        case 'algorithm-explanation':
          return await this.generateAlgorithmExplanationPrompt(args);
        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    });
  }

  // Tool implementations
  async executeCode(args) {
    const { language, code, input = '' } = args;
    
    try {
      // This would integrate with your existing code execution engine
      const result = await this.runCodeInSandbox(language, code, input);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              output: result.output,
              executionTime: result.executionTime,
              memoryUsage: result.memoryUsage
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error.message
            }, null, 2)
          }
        ]
      };
    }
  }

  async analyzeCode(args) {
    const { code, language } = args;
    
    // Basic code analysis
    const analysis = {
      lines: code.split('\n').length,
      complexity: this.calculateComplexity(code),
      suggestions: this.generateSuggestions(code, language),
      patterns: this.detectPatterns(code)
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(analysis, null, 2)
        }
      ]
    };
  }

  async getContestProblems(args) {
    const { platform, difficulty, limit = 10 } = args;
    
    // Mock contest problems - integrate with your existing contest fetchers
    const problems = [
      {
        title: "Two Sum",
        difficulty: difficulty || "easy",
        platform: platform,
        url: `https://${platform}.com/problems/two-sum`,
        description: "Given an array of integers, find two numbers that add up to a target sum."
      }
      // Add more problems based on your existing contest data
    ];

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(problems.slice(0, limit), null, 2)
        }
      ]
    };
  }

  async createLearningPath(args) {
    const { skill_level, focus_areas, time_commitment } = args;
    
    const learningPath = {
      skillLevel: skill_level,
      focusAreas: focus_areas,
      timeCommitment: time_commitment,
      weeklyPlan: this.generateWeeklyPlan(skill_level, focus_areas, time_commitment),
      milestones: this.generateMilestones(skill_level, focus_areas),
      resources: this.getRecommendedResources(focus_areas)
    };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(learningPath, null, 2)
        }
      ]
    };
  }

  async generateCodeTemplate(args) {
    const { template_type, language } = args;
    
    const templates = {
      'binary-search': {
        javascript: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
        python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`
      }
      // Add more templates
    };

    const template = templates[template_type]?.[language] || 'Template not found';

    return {
      content: [
        {
          type: 'text',
          text: template
        }
      ]
    };
  }

  // Resource implementations
  async getUserProgress() {
    // Mock user progress data
    const progress = {
      totalProblems: 150,
      solvedProblems: 89,
      currentStreak: 7,
      longestStreak: 15,
      skillLevels: {
        algorithms: 75,
        dataStructures: 82,
        webDevelopment: 60
      }
    };

    return {
      contents: [
        {
          uri: 'file://user-progress',
          mimeType: 'application/json',
          text: JSON.stringify(progress, null, 2)
        }
      ]
    };
  }

  // Prompt implementations
  async generateCodeReviewPrompt(args) {
    const { code, language } = args;
    
    const prompt = `Please review the following ${language} code and provide detailed feedback:

\`\`\`${language}
${code}
\`\`\`

Please analyze:
1. Code quality and readability
2. Performance optimizations
3. Best practices adherence
4. Potential bugs or issues
5. Suggestions for improvement

Provide specific examples and explanations for each point.`;

    return {
      description: 'Comprehensive code review prompt',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: prompt
          }
        }
      ]
    };
  }

  // Helper methods
  calculateComplexity(code) {
    // Simple complexity calculation based on control structures
    const complexityKeywords = ['if', 'for', 'while', 'switch', 'case'];
    let complexity = 1;
    
    complexityKeywords.forEach(keyword => {
      const matches = code.match(new RegExp(`\\b${keyword}\\b`, 'g'));
      if (matches) complexity += matches.length;
    });
    
    return complexity;
  }

  generateSuggestions(code, language) {
    const suggestions = [];
    
    if (code.includes('console.log') && language === 'javascript') {
      suggestions.push('Consider using a proper logging library instead of console.log');
    }
    
    if (code.length > 1000) {
      suggestions.push('Consider breaking this into smaller functions');
    }
    
    return suggestions;
  }

  detectPatterns(code) {
    const patterns = [];
    
    if (code.includes('for') && code.includes('for')) {
      patterns.push('nested-loops');
    }
    
    if (code.includes('if') && code.includes('else')) {
      patterns.push('conditional-logic');
    }
    
    return patterns;
  }

  async runCodeInSandbox(language, code, input) {
    // Mock execution - integrate with your existing code execution engine
    return {
      output: 'Hello World!',
      executionTime: '0.05s',
      memoryUsage: '1.2MB'
    };
  }

  generateWeeklyPlan(skillLevel, focusAreas, timeCommitment) {
    // Generate a weekly learning plan based on parameters
    return {
      week1: 'Introduction to fundamental concepts',
      week2: 'Hands-on practice with basic problems',
      week3: 'Intermediate problem solving',
      week4: 'Advanced techniques and optimization'
    };
  }

  generateMilestones(skillLevel, focusAreas) {
    return [
      'Complete 50 easy problems',
      'Master basic data structures',
      'Solve first medium difficulty problem',
      'Complete a coding contest'
    ];
  }

  getRecommendedResources(focusAreas) {
    return {
      videos: ['Algorithm basics course', 'Data structures tutorial'],
      books: ['Introduction to Algorithms', 'Cracking the Coding Interview'],
      practice: ['LeetCode', 'HackerRank', 'CodeForces']
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('Coding Dashboard MCP Server started');
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  const server = new CodingDashboardMCPServer();
  server.start().catch(console.error);
}

module.exports = CodingDashboardMCPServer;
