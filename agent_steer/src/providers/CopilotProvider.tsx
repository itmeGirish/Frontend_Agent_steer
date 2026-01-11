import { CopilotKit } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';

interface CopilotProviderProps {
  children: React.ReactNode;
  agentName?: string;
}

// CopilotKit runtime URL - connects to LangGraph agent
const COPILOT_RUNTIME_URL = import.meta.env.VITE_COPILOT_RUNTIME_URL || '/api/copilotkit';

export function CopilotProvider({
  children,
  agentName = 'sample_agent'
}: CopilotProviderProps) {
  return (
    <CopilotKit runtimeUrl={COPILOT_RUNTIME_URL} agent={agentName}>
      {children}
    </CopilotKit>
  );
}
