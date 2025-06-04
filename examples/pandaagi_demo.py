#!/usr/bin/env python3
"""
PandaAGI MCP Server Demo

This script demonstrates how to interact with the PandaAGI MCP server
using both direct MCP calls and the FastAPI client interface.
"""

import asyncio
import json
import requests
from typing import Dict, Any

# Configuration
MCP_SERVER_URL = "http://localhost:8888/mcp"
FASTAPI_URL = "http://localhost:8001"

def make_mcp_request(method: str, params: Dict[str, Any] = None) -> Dict[str, Any]:
    """Make a direct MCP request"""
    payload = {
        "jsonrpc": "2.0",
        "method": method,
        "params": params or {},
        "id": 1
    }
    
    response = requests.post(MCP_SERVER_URL, json=payload)
    response.raise_for_status()
    result = response.json()
    
    if "error" in result:
        raise Exception(f"MCP Error: {result['error']['message']}")
    
    return result.get("result", {})

def make_fastapi_request(endpoint: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
    """Make a FastAPI request"""
    url = f"{FASTAPI_URL}{endpoint}"
    
    if data:
        response = requests.post(url, json=data)
    else:
        response = requests.get(url)
    
    response.raise_for_status()
    return response.json()

def demo_mcp_direct():
    """Demonstrate direct MCP protocol usage"""
    print("🐼 PandaAGI MCP Direct Protocol Demo")
    print("=" * 50)
    
    # Initialize server
    print("1. Initializing MCP server...")
    init_result = make_mcp_request("mcp/init")
    print(f"   Server: {init_result['serverInfo']['name']} v{init_result['serverInfo']['version']}")
    
    # List tools
    print("\n2. Listing available tools...")
    tools_result = make_mcp_request("mcp/listTools")
    for tool in tools_result['tools']:
        print(f"   - {tool['name']}: {tool['description']}")
    
    # Call a tool
    print("\n3. Creating an agent...")
    agent_result = make_mcp_request("mcp/callTool", {
        "name": "create-agent",
        "args": {
            "name": "demo-agent",
            "environment": "local",
            "workspace_path": "./demo_workspace"
        }
    })
    print("   ✅ Agent creation configured")
    
    # Run a task
    print("\n4. Running a simple task...")
    task_result = make_mcp_request("mcp/callTool", {
        "name": "run-agent-task", 
        "args": {
            "task": "Tell me a fun fact about pandas (the animal, not the library)",
            "agent_name": "demo-agent"
        }
    })
    print("   ✅ Task execution configured")
    
    # List resources
    print("\n5. Listing documentation resources...")
    resources_result = make_mcp_request("mcp/listResources")
    for resource in resources_result['resources']:
        print(f"   - {resource['name']}")
    
    print("\n✅ Direct MCP demo completed!")

def demo_fastapi_client():
    """Demonstrate FastAPI client usage"""
    print("\n🚀 PandaAGI FastAPI Client Demo")
    print("=" * 50)
    
    # Health check
    print("1. Checking client health...")
    health = make_fastapi_request("/health")
    print(f"   Status: {health['status']}")
    
    # Server info
    print("\n2. Getting server information...")
    server_info = make_fastapi_request("/server")
    print(f"   Server: {server_info['serverInfo']['name']}")
    
    # Create agent
    print("\n3. Creating an agent via FastAPI...")
    agent_response = make_fastapi_request("/agent/create", {
        "name": "fastapi-agent",
        "environment": "local"
    })
    print("   ✅ Agent created successfully")
    
    # Generate analysis report
    print("\n4. Generating an analysis report...")
    report_response = make_fastapi_request("/analysis/report", {
        "topic": "Artificial Intelligence Market Trends 2024",
        "data_sources": ["industry reports", "market research"],
        "report_type": "trend_analysis"
    })
    print("   ✅ Analysis report configured")
    
    # Create dashboard
    print("\n5. Creating a data dashboard...")
    dashboard_response = make_fastapi_request("/dashboard/create", {
        "data_description": "Sales performance metrics for Q4 2024",
        "dashboard_type": "sales",
        "chart_types": ["line", "bar", "pie"]
    })
    print("   ✅ Dashboard creation configured")
    
    # Deploy web app
    print("\n6. Deploying a web application...")
    webapp_response = make_fastapi_request("/webapp/deploy", {
        "app_description": "A portfolio website for a data scientist",
        "app_type": "streamlit",
        "features": ["project gallery", "skills showcase", "contact form"]
    })
    print("   ✅ Web application deployment configured")
    
    print("\n✅ FastAPI client demo completed!")

def demo_advanced_usage():
    """Demonstrate advanced PandaAGI usage patterns"""
    print("\n🧠 Advanced PandaAGI Usage Demo")
    print("=" * 50)
    
    # Complex market analysis
    print("1. Complex market analysis task...")
    complex_task = """
    Conduct a comprehensive analysis of the electric vehicle market:
    1. Research current market size and growth projections
    2. Identify top 5 competitors and their market share
    3. Analyze consumer adoption trends
    4. Create visualizations showing market evolution
    5. Provide strategic recommendations for new entrants
    6. Generate executive summary and detailed report
    """
    
    task_response = make_fastapi_request("/agent/task", {
        "task": complex_task,
        "agent_name": "market-analyst"
    })
    print("   ✅ Complex analysis task configured")
    
    # Multi-step workflow
    print("\n2. Multi-step workflow example...")
    workflow_steps = [
        "Research latest AI/ML trends for 2024",
        "Create a competitive analysis of AI platforms", 
        "Build interactive dashboard showing market data",
        "Generate blog post content with insights",
        "Deploy a web application showcasing findings"
    ]
    
    for i, step in enumerate(workflow_steps, 1):
        print(f"   Step {i}: {step}")
        # In a real scenario, you'd make individual requests for each step
    
    print("   ✅ Multi-step workflow outlined")
    
    # Custom application deployment
    print("\n3. Custom application deployment...")
    app_description = """
    Create a comprehensive AI-powered business intelligence dashboard:
    - Real-time data visualization
    - Interactive charts and graphs
    - Predictive analytics components
    - User authentication and role management
    - Export functionality for reports
    - Mobile-responsive design
    """
    
    deployment_response = make_fastapi_request("/webapp/deploy", {
        "app_description": app_description,
        "app_type": "fastapi",
        "features": [
            "real-time data",
            "user authentication", 
            "predictive analytics",
            "export functionality",
            "mobile responsive"
        ]
    })
    print("   ✅ Custom application deployment configured")
    
    print("\n✅ Advanced usage demo completed!")

def main():
    """Run all demonstrations"""
    print("🌟 PandaAGI MCP Server Comprehensive Demo")
    print("=" * 60)
    print("This demo showcases the capabilities of the PandaAGI MCP server")
    print("Make sure both services are running:")
    print("- MCP Server: http://localhost:8888/mcp")
    print("- FastAPI Client: http://localhost:8001")
    print()
    
    try:
        # Run demonstrations
        demo_mcp_direct()
        demo_fastapi_client()
        demo_advanced_usage()
        
        print("\n🎉 All demonstrations completed successfully!")
        print("\n💡 Next Steps:")
        print("1. Visit http://localhost:8001/docs for interactive API documentation")
        print("2. Try the MCP Inspector: npx @modelcontextprotocol/inspector npx mcp-remote@next http://localhost:8888/mcp")
        print("3. Explore the examples in the repository")
        print("4. Build your own PandaAGI applications!")
        
    except Exception as e:
        print(f"\n❌ Demo failed: {e}")
        print("\nMake sure both services are running:")
        print("cd mcp-client && ./start_pandaagi.sh")

if __name__ == "__main__":
    main()