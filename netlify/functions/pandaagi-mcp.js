/**
 * PandaAGI MCP Server Implementation
 * 
 * This MCP server provides tools and resources for interacting with PandaAGI,
 * an SDK for building Agentic General Intelligence applications.
 * 
 * Capabilities:
 * - Create and manage AI agents
 * - Execute tasks with various environments
 * - Web search and data analysis
 * - File system operations
 * - Code execution and deployment
 */

exports.handler = async (event, context) => {
  // Only handle POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const request = JSON.parse(event.body);
    const { method, params, id } = request;

    switch (method) {
      case 'mcp/init':
        return handleInit(id);
      
      case 'mcp/listTools':
        return handleListTools(id);
      
      case 'mcp/callTool':
        return handleCallTool(params, id);
      
      case 'mcp/listResources':
        return handleListResources(id);
      
      case 'mcp/readResource':
        return handleReadResource(params, id);
      
      default:
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32601, message: "Method not found" },
            id
          })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal error: " + error.message },
        id: null
      })
    };
  }
};

function handleInit(id) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: {},
          resources: {}
        },
        serverInfo: {
          name: "pandaagi-mcp-server",
          version: "1.0.0",
          description: "MCP server for PandaAGI - Agentic General Intelligence"
        }
      },
      id
    })
  };
}

function handleListTools(id) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      result: {
        tools: [
          {
            name: "create-agent",
            description: "Create a new PandaAGI agent with specified configuration",
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Name for the agent"
                },
                environment: {
                  type: "string",
                  enum: ["local", "docker"],
                  description: "Execution environment for the agent",
                  default: "local"
                },
                workspace_path: {
                  type: "string",
                  description: "Path to the agent's workspace directory",
                  default: "./agent_workspace"
                }
              },
              required: ["name"],
              additionalProperties: false
            }
          },
          {
            name: "run-agent-task",
            description: "Execute a task using a PandaAGI agent",
            schema: {
              type: "object",
              properties: {
                task: {
                  type: "string",
                  description: "The task or instruction for the agent to execute"
                },
                agent_name: {
                  type: "string",
                  description: "Name of the agent to use (optional, will create default if not specified)"
                },
                environment: {
                  type: "string",
                  enum: ["local", "docker"],
                  description: "Execution environment",
                  default: "local"
                },
                workspace_path: {
                  type: "string",
                  description: "Workspace directory path",
                  default: "./agent_workspace"
                }
              },
              required: ["task"],
              additionalProperties: false
            }
          },
          {
            name: "generate-analysis-report",
            description: "Generate an analysis report using PandaAGI's data analysis capabilities",
            schema: {
              type: "object",
              properties: {
                topic: {
                  type: "string",
                  description: "Topic or subject for the analysis report"
                },
                data_sources: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  description: "List of data sources or keywords for research"
                },
                report_type: {
                  type: "string",
                  enum: ["market_analysis", "competitive_analysis", "trend_analysis", "general"],
                  description: "Type of analysis report to generate",
                  default: "general"
                }
              },
              required: ["topic"],
              additionalProperties: false
            }
          },
          {
            name: "create-dashboard",
            description: "Create a data visualization dashboard using PandaAGI",
            schema: {
              type: "object",
              properties: {
                data_description: {
                  type: "string",
                  description: "Description of the data to visualize"
                },
                dashboard_type: {
                  type: "string",
                  enum: ["sales", "analytics", "performance", "custom"],
                  description: "Type of dashboard to create",
                  default: "custom"
                },
                chart_types: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["line", "bar", "pie", "scatter", "heatmap", "table"]
                  },
                  description: "Preferred chart types for the dashboard"
                }
              },
              required: ["data_description"],
              additionalProperties: false
            }
          },
          {
            name: "deploy-web-app",
            description: "Deploy a web application using PandaAGI's deployment capabilities",
            schema: {
              type: "object",
              properties: {
                app_description: {
                  type: "string",
                  description: "Description of the web application to create and deploy"
                },
                app_type: {
                  type: "string",
                  enum: ["streamlit", "flask", "fastapi", "static"],
                  description: "Type of web application framework",
                  default: "streamlit"
                },
                features: {
                  type: "array",
                  items: {
                    type: "string"
                  },
                  description: "List of features to include in the application"
                }
              },
              required: ["app_description"],
              additionalProperties: false
            }
          }
        ]
      },
      id
    })
  };
}

function handleCallTool(params, id) {
  const { name, args } = params;
  
  switch (name) {
    case "create-agent":
      return handleCreateAgent(args, id);
    
    case "run-agent-task":
      return handleRunAgentTask(args, id);
    
    case "generate-analysis-report":
      return handleGenerateAnalysisReport(args, id);
    
    case "create-dashboard":
      return handleCreateDashboard(args, id);
    
    case "deploy-web-app":
      return handleDeployWebApp(args, id);
    
    default:
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32602, message: "Unknown tool" },
          id
        })
      };
  }
}

function handleCreateAgent(args, id) {
  const { name, environment = "local", workspace_path = "./agent_workspace" } = args;
  
  const agentConfig = {
    agentId: `agent-${Date.now()}`,
    name: name,
    environment: environment,
    workspace_path: workspace_path,
    created_at: new Date().toISOString(),
    status: "ready",
    capabilities: [
      "web_access",
      "file_system",
      "code_execution",
      "deployment"
    ]
  };

  const pythonCode = `
# PandaAGI Agent Creation
import asyncio
from panda_agi import Agent
from panda_agi.envs import LocalEnv

async def create_agent():
    # Create environment
    agent_env = LocalEnv("${workspace_path}")
    
    # Create the agent
    agent = Agent(environment=agent_env)
    
    print(f"Agent '${name}' created successfully!")
    print(f"Environment: ${environment}")
    print(f"Workspace: ${workspace_path}")
    
    return agent

# To use this agent, run:
# agent = asyncio.run(create_agent())
`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      result: {
        content: [
          {
            type: "text",
            text: `Agent "${name}" configuration created successfully!\n\n` +
                  `Configuration:\n${JSON.stringify(agentConfig, null, 2)}\n\n` +
                  `Python code to create the agent:\n\`\`\`python\n${pythonCode}\n\`\`\``
          }
        ]
      },
      id
    })
  };
}

function handleRunAgentTask(args, id) {
  const { task, agent_name = "default", environment = "local", workspace_path = "./agent_workspace" } = args;
  
  const pythonCode = `
# Execute PandaAGI Task
import asyncio
from panda_agi import Agent
from panda_agi.envs import LocalEnv

async def run_task():
    # Create environment
    agent_env = LocalEnv("${workspace_path}")
    
    # Create the agent
    agent = Agent(environment=agent_env)
    
    # Execute the task
    print(f"Executing task: ${task}")
    response = agent.run("${task}")
    
    print("Task completed!")
    print("Response:", response.output)
    
    # Cleanup
    await agent.disconnect()
    
    return response

# Run the task
if __name__ == "__main__":
    result = asyncio.run(run_task())
`;

  const mockResponse = generateMockTaskResponse(task);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      result: {
        content: [
          {
            type: "text",
            text: `Task execution configured for agent "${agent_name}":\n\n` +
                  `Task: ${task}\n\n` +
                  `Python code to execute:\n\`\`\`python\n${pythonCode}\n\`\`\`\n\n` +
                  `Expected output:\n${mockResponse}`
          }
        ]
      },
      id
    })
  };
}

function handleGenerateAnalysisReport(args, id) {
  const { topic, data_sources = [], report_type = "general" } = args;
  
  const reportConfig = {
    topic: topic,
    report_type: report_type,
    data_sources: data_sources,
    generated_at: new Date().toISOString()
  };

  const pythonCode = `
# Generate Analysis Report with PandaAGI
import asyncio
from panda_agi import Agent
from panda_agi.envs import LocalEnv

async def generate_report():
    # Create environment
    agent_env = LocalEnv("./reports_workspace")
    
    # Create the agent
    agent = Agent(environment=agent_env)
    
    # Generate comprehensive analysis report
    task = """
    Create a comprehensive ${report_type} analysis report on: ${topic}
    
    ${data_sources.length > 0 ? `Research these data sources: ${data_sources.join(', ')}` : ''}
    
    The report should include:
    1. Executive Summary
    2. Market Overview
    3. Key Findings
    4. Data Analysis with Charts
    5. Recommendations
    6. Conclusion
    
    Save the report as both PDF and HTML formats.
    """
    
    response = agent.run(task)
    
    print("Analysis report generated successfully!")
    await agent.disconnect()
    
    return response

# Generate the report
if __name__ == "__main__":
    result = asyncio.run(generate_report())
`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      result: {
        content: [
          {
            type: "text",
            text: `Analysis report generation configured:\n\n` +
                  `Configuration:\n${JSON.stringify(reportConfig, null, 2)}\n\n` +
                  `Python code to generate the report:\n\`\`\`python\n${pythonCode}\n\`\`\``
          }
        ]
      },
      id
    })
  };
}

function handleCreateDashboard(args, id) {
  const { data_description, dashboard_type = "custom", chart_types = ["line", "bar"] } = args;
  
  const pythonCode = `
# Create Dashboard with PandaAGI
import asyncio
from panda_agi import Agent
from panda_agi.envs import LocalEnv

async def create_dashboard():
    # Create environment
    agent_env = LocalEnv("./dashboard_workspace")
    
    # Create the agent
    agent = Agent(environment=agent_env)
    
    # Create interactive dashboard
    task = """
    Create an interactive ${dashboard_type} dashboard for: ${data_description}
    
    Include these chart types: ${chart_types.join(', ')}
    
    The dashboard should:
    1. Load and analyze the data
    2. Create interactive visualizations
    3. Add filters and controls
    4. Include key metrics and KPIs
    5. Export as a web application
    6. Make it responsive for mobile devices
    
    Use Streamlit or Plotly Dash for the web interface.
    """
    
    response = agent.run(task)
    
    print("Dashboard created successfully!")
    await agent.disconnect()
    
    return response

# Create the dashboard
if __name__ == "__main__":
    result = asyncio.run(create_dashboard())
`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      result: {
        content: [
          {
            type: "text",
            text: `Dashboard creation configured:\n\n` +
                  `Type: ${dashboard_type}\n` +
                  `Data: ${data_description}\n` +
                  `Chart Types: ${chart_types.join(', ')}\n\n` +
                  `Python code to create the dashboard:\n\`\`\`python\n${pythonCode}\n\`\`\``
          }
        ]
      },
      id
    })
  };
}

function handleDeployWebApp(args, id) {
  const { app_description, app_type = "streamlit", features = [] } = args;
  
  const pythonCode = `
# Deploy Web App with PandaAGI
import asyncio
from panda_agi import Agent
from panda_agi.envs import LocalEnv

async def deploy_web_app():
    # Create environment
    agent_env = LocalEnv("./webapp_workspace")
    
    # Create the agent
    agent = Agent(environment=agent_env)
    
    # Create and deploy web application
    task = """
    Create and deploy a ${app_type} web application: ${app_description}
    
    ${features.length > 0 ? `Include these features: ${features.join(', ')}` : ''}
    
    Steps:
    1. Design the application architecture
    2. Implement the core functionality
    3. Create user interface
    4. Add error handling and validation
    5. Test the application
    6. Deploy to a web server
    7. Provide access URL and documentation
    
    Make sure the app is production-ready with proper styling.
    """
    
    response = agent.run(task)
    
    print("Web application deployed successfully!")
    await agent.disconnect()
    
    return response

# Deploy the application
if __name__ == "__main__":
    result = asyncio.run(deploy_web_app())
`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      result: {
        content: [
          {
            type: "text",
            text: `Web application deployment configured:\n\n` +
                  `Type: ${app_type}\n` +
                  `Description: ${app_description}\n` +
                  `Features: ${features.join(', ')}\n\n` +
                  `Python code to deploy the application:\n\`\`\`python\n${pythonCode}\n\`\`\``
          }
        ]
      },
      id
    })
  };
}

function handleListResources(id) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      result: {
        resources: [
          {
            name: "PandaAGI Documentation",
            uri: "docs://pandaagi-docs",
            metadata: {
              mimeType: "text/markdown"
            }
          },
          {
            name: "PandaAGI Quick Start Guide",
            uri: "docs://pandaagi-quickstart",
            metadata: {
              mimeType: "text/markdown"
            }
          },
          {
            name: "Agent Best Practices",
            uri: "docs://agent-best-practices",
            metadata: {
              mimeType: "text/markdown"
            }
          },
          {
            name: "PandaAGI Examples",
            uri: "docs://pandaagi-examples",
            metadata: {
              mimeType: "text/markdown"
            }
          }
        ]
      },
      id
    })
  };
}

function handleReadResource(params, id) {
  const { uri } = params;
  
  let content = "";
  
  switch (uri) {
    case "docs://pandaagi-docs":
      content = `# PandaAGI SDK Documentation

## Overview
PandaAGI is a powerful SDK for building Agentic General Intelligence applications. It provides a simple API for creating AI agents that can execute tasks autonomously.

## Key Features
- **Agentic Capabilities**: Build AI agents that can accomplish tasks through tools
- **Local Orchestration**: All execution happens in your environment with full control
- **Universal Capability**: Create solutions for any domain or use case
- **Developer-First**: Focus on user experience while we handle AI complexity

## Core Components
1. **The API**: Bidirectional WebSocket connection for real-time interaction
2. **The SDK**: Handles orchestration, state management, and communication
3. **The Execution Environment**: Secure, isolated context for agent operations

## Built-in Agent Capabilities
- 🌐 **Internet Access**: Real-time information gathering from any source
- 🗂️ **File System**: Complete control over digital assets
- 💻 **Code Execution**: Dynamic programming in multiple languages
- 🚀 **Deployment**: Deploy web servers and APIs directly

## Installation
\`\`\`bash
pip install panda-agi
\`\`\`

## Basic Usage
\`\`\`python
import asyncio
from panda_agi import Agent
from panda_agi.envs import LocalEnv

async def main():
    # Create environment
    agent_env = LocalEnv("./workspace")
    
    # Create agent
    agent = Agent(environment=agent_env)
    
    # Execute task
    response = agent.run("Analyze market trends")
    print(response.output)
    
    # Cleanup
    await agent.disconnect()

asyncio.run(main())
\`\`\``;
      break;
      
    case "docs://pandaagi-quickstart":
      content = `# PandaAGI Quick Start Guide

## Prerequisites
- Python 3.8+
- PandaAGI API key from [agi.pandas-ai.com](https://agi.pandas-ai.com/)

## Step 1: Installation
\`\`\`bash
pip install panda-agi
\`\`\`

## Step 2: Set API Key
\`\`\`bash
export PANDA_AGI_KEY=your_api_key
\`\`\`

## Step 3: Create Your First Agent
\`\`\`python
import asyncio
from panda_agi import Agent
from panda_agi.envs import LocalEnv

async def first_agent():
    # Create workspace
    agent_env = LocalEnv("./my_workspace")
    
    # Create agent
    agent = Agent(environment=agent_env)
    
    # Simple task
    response = agent.run("Tell me a joke about pandas")
    print(response.output)
    
    await agent.disconnect()

asyncio.run(first_agent())
\`\`\`

## Step 4: Try Advanced Tasks
\`\`\`python
# Generate a report
response = agent.run("Create a market analysis report for renewable energy")

# Build a dashboard
response = agent.run("Create a sales dashboard from our CSV data")

# Deploy a website
response = agent.run("Build a portfolio website for our company")
\`\`\`

## Next Steps
- Explore the examples directory
- Read the full documentation
- Join the Discord community
- Start building your own applications!`;
      break;
      
    case "docs://agent-best-practices":
      content = `# PandaAGI Agent Best Practices

## Agent Design Principles

### 1. Clear Task Definition
- Write specific, actionable instructions
- Break complex tasks into smaller steps
- Provide context and constraints

### 2. Environment Management
- Use dedicated workspaces for different projects
- Keep environments clean and organized
- Monitor resource usage

### 3. Error Handling
- Implement proper error handling in your code
- Test agents with various scenarios
- Monitor agent performance and logs

## Task Writing Guidelines

### Good Task Examples:
\`\`\`python
# Specific and actionable
agent.run("Analyze sales data from Q4 2024 and create a bar chart showing monthly revenue")

# Provides context
agent.run("Create a Python web scraper for product prices from ecommerce sites, focusing on electronics")
\`\`\`

### Avoid Vague Tasks:
\`\`\`python
# Too vague
agent.run("Do something with data")

# Lacks specificity
agent.run("Make a website")
\`\`\`

## Performance Optimization

### 1. Workspace Organization
- Keep files organized in logical folders
- Use descriptive file names
- Clean up temporary files regularly

### 2. Resource Management
- Monitor memory and CPU usage
- Use appropriate environment sizes
- Implement caching where beneficial

### 3. Security Considerations
- Validate inputs and outputs
- Use secure environments for sensitive data
- Implement proper access controls

## Common Patterns

### Data Analysis Pipeline:
1. Load and validate data
2. Explore and clean data
3. Perform analysis
4. Generate visualizations
5. Create report

### Web Application Development:
1. Design application architecture
2. Implement core functionality
3. Create user interface
4. Add error handling
5. Test and deploy

## Troubleshooting Tips
- Check API key configuration
- Verify workspace permissions
- Monitor agent logs for errors
- Test with simpler tasks first
- Use the community forum for help`;
      break;
      
    case "docs://pandaagi-examples":
      content = `# PandaAGI Examples

## Example 1: Data Analysis Report
\`\`\`python
import asyncio
from panda_agi import Agent
from panda_agi.envs import LocalEnv

async def data_analysis_example():
    agent_env = LocalEnv("./analysis_workspace")
    agent = Agent(environment=agent_env)
    
    task = """
    Analyze the provided sales data and create a comprehensive report:
    1. Load the CSV file
    2. Calculate key metrics (total sales, growth rate, top products)
    3. Create visualizations (line charts, bar charts, pie charts)
    4. Generate insights and recommendations
    5. Export as PDF report
    """
    
    response = agent.run(task)
    print("Analysis complete:", response.output)
    
    await agent.disconnect()
\`\`\`

## Example 2: Web Application
\`\`\`python
async def web_app_example():
    agent_env = LocalEnv("./webapp_workspace")
    agent = Agent(environment=agent_env)
    
    task = """
    Create a Streamlit web application for data visualization:
    1. Build an interface for uploading CSV files
    2. Add data filtering and sorting controls
    3. Create interactive charts (plotly)
    4. Add export functionality
    5. Deploy the app locally
    """
    
    response = agent.run(task)
    await agent.disconnect()
\`\`\`

## Example 3: Market Research
\`\`\`python
async def market_research_example():
    agent_env = LocalEnv("./research_workspace")
    agent = Agent(environment=agent_env)
    
    task = """
    Conduct market research on electric vehicles:
    1. Search for recent market data and trends
    2. Analyze competitor information
    3. Identify key market drivers
    4. Create market size projections
    5. Generate executive summary
    """
    
    response = agent.run(task)
    await agent.disconnect()
\`\`\`

## Example 4: Automation Script
\`\`\`python
async def automation_example():
    agent_env = LocalEnv("./automation_workspace")
    agent = Agent(environment=agent_env)
    
    task = """
    Create an automation script for daily reports:
    1. Connect to database
    2. Extract yesterday's data
    3. Generate summary statistics
    4. Create charts and visualizations
    5. Send email with report attachment
    """
    
    response = agent.run(task)
    await agent.disconnect()
\`\`\`

## Example 5: Content Generation
\`\`\`python
async def content_generation_example():
    agent_env = LocalEnv("./content_workspace")
    agent = Agent(environment=agent_env)
    
    task = """
    Generate content for our tech blog:
    1. Research latest AI trends
    2. Write engaging blog post (1500 words)
    3. Create supporting graphics
    4. Format for web publishing
    5. Generate social media posts
    """
    
    response = agent.run(task)
    await agent.disconnect()
\`\`\`

## Running the Examples
1. Install PandaAGI: \`pip install panda-agi\`
2. Set your API key: \`export PANDA_AGI_KEY=your_key\`
3. Copy any example code
4. Run: \`python your_example.py\`

## Tips for Success
- Start with simple tasks and gradually increase complexity
- Monitor the workspace directory for generated files
- Check logs for detailed execution information
- Experiment with different task descriptions
- Use the UI for interactive development`;
      break;
      
    default:
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32602, message: "Resource not found" },
          id
        })
      };
  }
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      result: {
        contents: [
          {
            uri: uri,
            text: content
          }
        ]
      },
      id
    })
  };
}

function generateMockTaskResponse(task) {
  const responses = {
    "joke": "🐼 Why don't pandas ever get tired? Because they always have their bear-y own energy! Plus, they're always bamboo-zled by how much they can accomplish!",
    "analysis": "I'll create a comprehensive analysis with data visualizations, charts, and actionable insights saved to your workspace.",
    "dashboard": "Interactive dashboard created with real-time data updates and responsive design for all devices.",
    "website": "Professional website deployed with modern design, SEO optimization, and mobile responsiveness.",
    "report": "Detailed report generated with executive summary, key findings, and recommendations in PDF format."
  };
  
  // Simple keyword matching for demo purposes
  for (const [key, response] of Object.entries(responses)) {
    if (task.toLowerCase().includes(key)) {
      return response;
    }
  }
  
  return "Task will be executed by the PandaAGI agent with full autonomous capabilities including web access, file operations, and code execution.";
}