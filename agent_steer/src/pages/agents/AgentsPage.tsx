import { useSearchParams, Navigate } from 'react-router-dom';
import { getAgentById } from '@/config/agents';
import { AgentWorkspace } from '@/features/agents';

export function AgentsPage() {
  const [searchParams] = useSearchParams();
  const agentType = searchParams.get('type');

  // If no agent type specified, redirect to whatsapp by default
  if (!agentType) {
    return <Navigate to="/agents?type=whatsapp" replace />;
  }

  // Get agent configuration
  const agent = getAgentById(agentType);

  // If agent not found, redirect to whatsapp
  if (!agent) {
    return <Navigate to="/agents?type=whatsapp" replace />;
  }

  return <AgentWorkspace agent={agent} />;
}
