import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom'

// Platform Level - AgentSteer Workspace (public shell)
import { LandingPage } from './agentsteer-workspace'

// Agent Hub - Agent discovery and navigation
import { AgentHubPage } from './agent-hub'

// Agents - Individual agent workspaces
import { getAgentById, getAgentWorkspace } from './agents'

// Agent Workspace Route Component
function AgentWorkspaceRoute() {
  const { agentId } = useParams<{ agentId: string }>()

  if (!agentId) {
    return <Navigate to="/hub" replace />
  }

  const agent = getAgentById(agentId)

  if (!agent) {
    return <Navigate to="/hub" replace />
  }

  const WorkspaceComponent = getAgentWorkspace(agentId)
  return <WorkspaceComponent agent={agent} />
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Platform Level - AgentSteer AI Workspace (Public) */}
        <Route path="/" element={<LandingPage />} />

        {/* Agent Hub - Agent Discovery (After Login) */}
        <Route path="/hub" element={<AgentHubPage />} />

        {/* Individual Agent Workspaces */}
        <Route path="/agents/:agentId" element={<AgentWorkspaceRoute />} />

        {/* Fallback to landing page */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  )
}

export default App
