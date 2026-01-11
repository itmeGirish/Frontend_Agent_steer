import { CopilotChat, type CopilotKitCSSProperties } from '@copilotkit/react-ui';
import type { AgentConfig } from '@/config/agents';
import { QuickActionButtons } from './QuickActionButtons';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useChatStyles } from '../hooks/useChatStyles';

interface AgentChatPanelProps {
  agent: AgentConfig;
  themeColor: string;
  width?: string;
}

/**
 * Reusable chat panel component for all agents
 */
export function AgentChatPanel({
  agent,
  themeColor,
  width = '550px'
}: AgentChatPanelProps) {
  // Apply chat styles
  useChatStyles();

  // Enable auto-scroll
  useAutoScroll(`.w-\\[${width}\\]`);

  return (
    <div
      className={`w-[${width}] border-l border-gray-200 flex flex-col`}
      style={{ '--copilot-kit-primary-color': themeColor } as CopilotKitCSSProperties}
    >
      <CopilotChat
        labels={{
          title: agent.name,
          initial: `Hi! I'm your ${agent.name}. ${agent.description}`,
        }}
        instructions={`You are ${agent.name}. ${agent.description}`}
        className="flex-1"
      />
      <QuickActionButtons
        actions={agent.actions}
        themeColor={themeColor}
      />
    </div>
  );
}
