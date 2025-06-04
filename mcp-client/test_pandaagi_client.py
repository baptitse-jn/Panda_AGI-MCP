#!/usr/bin/env python3
"""
Test script for PandaAGI MCP Client API
"""

import requests
import json
import os
from typing import Dict, Any

# API base URL
API_BASE = os.getenv("API_BASE", "http://localhost:8001")

def make_request(method: str, endpoint: str, data: Dict[str, Any] = None) -> Dict[str, Any]:
    """Make a request to the API"""
    url = f"{API_BASE}{endpoint}"
    
    try:
        if method.upper() == "GET":
            response = requests.get(url)
        elif method.upper() == "POST":
            response = requests.post(url, json=data)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")
        return {}

def test_health():
    """Test health check endpoint"""
    print("🩺 Testing health check...")
    result = make_request("GET", "/health")
    if result.get("status") == "healthy":
        print("✅ Health check passed")
        return True
    else:
        print("❌ Health check failed")
        return False

def test_server_info():
    """Test server information endpoint"""
    print("\n🔍 Testing server info...")
    result = make_request("GET", "/server")
    if result.get("serverInfo", {}).get("name") == "pandaagi-mcp-server":
        print("✅ Server info retrieved successfully")
        print(f"   Server: {result['serverInfo']['name']} v{result['serverInfo']['version']}")
        return True
    else:
        print("❌ Failed to get server info")
        return False

def test_list_tools():
    """Test listing available tools"""
    print("\n🛠️ Testing tools list...")
    result = make_request("GET", "/tools")
    tools = result.get("tools", [])
    if tools:
        print(f"✅ Found {len(tools)} tools:")
        for tool in tools:
            print(f"   - {tool['name']}: {tool['description']}")
        return True
    else:
        print("❌ No tools found")
        return False

def test_create_agent():
    """Test creating a PandaAGI agent"""
    print("\n🤖 Testing agent creation...")
    data = {
        "name": "test-agent",
        "environment": "local",
        "workspace_path": "./test_workspace"
    }
    result = make_request("POST", "/agent/create", data)
    if result.get("status") == "success":
        print("✅ Agent creation configured successfully")
        return True
    else:
        print("❌ Agent creation failed")
        return False

def test_run_task():
    """Test running a task with PandaAGI"""
    print("\n🎯 Testing task execution...")
    data = {
        "task": "Tell me a joke about pandas and AI",
        "agent_name": "test-agent"
    }
    result = make_request("POST", "/agent/task", data)
    if result.get("status") == "success":
        print("✅ Task execution configured successfully")
        # Extract and display the response content
        content = result.get("result", {}).get("content", [])
        if content:
            print("   Response preview:", content[0]["text"][:100] + "...")
        return True
    else:
        print("❌ Task execution failed")
        return False

def test_generate_report():
    """Test generating an analysis report"""
    print("\n📊 Testing analysis report generation...")
    data = {
        "topic": "AI trends in 2024",
        "data_sources": ["tech news", "market research"],
        "report_type": "trend_analysis"
    }
    result = make_request("POST", "/analysis/report", data)
    if result.get("status") == "success":
        print("✅ Analysis report generation configured successfully")
        return True
    else:
        print("❌ Analysis report generation failed")
        return False

def test_create_dashboard():
    """Test creating a dashboard"""
    print("\n📈 Testing dashboard creation...")
    data = {
        "data_description": "Sales data from our e-commerce platform",
        "dashboard_type": "sales",
        "chart_types": ["line", "bar", "pie"]
    }
    result = make_request("POST", "/dashboard/create", data)
    if result.get("status") == "success":
        print("✅ Dashboard creation configured successfully")
        return True
    else:
        print("❌ Dashboard creation failed")
        return False

def test_deploy_webapp():
    """Test deploying a web application"""
    print("\n🚀 Testing web app deployment...")
    data = {
        "app_description": "A simple portfolio website for a data scientist",
        "app_type": "streamlit",
        "features": ["portfolio gallery", "contact form", "blog section"]
    }
    result = make_request("POST", "/webapp/deploy", data)
    if result.get("status") == "success":
        print("✅ Web app deployment configured successfully")
        return True
    else:
        print("❌ Web app deployment failed")
        return False

def test_list_resources():
    """Test listing available resources"""
    print("\n📚 Testing resources list...")
    result = make_request("GET", "/resources")
    resources = result.get("resources", [])
    if resources:
        print(f"✅ Found {len(resources)} resources:")
        for resource in resources:
            print(f"   - {resource['name']}")
        return True
    else:
        print("❌ No resources found")
        return False

def test_read_resource():
    """Test reading a resource"""
    print("\n📖 Testing resource reading...")
    data = {"uri": "docs://pandaagi-quickstart"}
    result = make_request("POST", "/resources/read", data)
    contents = result.get("contents", [])
    if contents:
        print("✅ Resource read successfully")
        print(f"   Content preview: {contents[0]['text'][:100]}...")
        return True
    else:
        print("❌ Failed to read resource")
        return False

def main():
    """Run all tests"""
    print("🐼 PandaAGI MCP Client API Test Suite")
    print("=" * 50)
    
    tests = [
        test_health,
        test_server_info,
        test_list_tools,
        test_create_agent,
        test_run_task,
        test_generate_report,
        test_create_dashboard,
        test_deploy_webapp,
        test_list_resources,
        test_read_resource
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
    
    print("\n" + "=" * 50)
    print(f"🏁 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! PandaAGI MCP Client is working correctly.")
    else:
        print("⚠️ Some tests failed. Check the output above for details.")
    
    return passed == total

if __name__ == "__main__":
    main()