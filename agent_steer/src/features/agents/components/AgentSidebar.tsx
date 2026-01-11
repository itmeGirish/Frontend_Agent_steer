import { getAllAgents, type AgentConfig } from '@/config/agents';
import { useNavigate } from 'react-router-dom';

interface AgentSidebarProps {
  currentAgentId: string;
}

export function AgentSidebar({ currentAgentId }: AgentSidebarProps) {
  const navigate = useNavigate();
  const agents = getAllAgents();

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Agents
        </h2>
        <div className="space-y-1">
          {agents.map((agent) => (
            <AgentNavItem
              key={agent.id}
              agent={agent}
              isActive={agent.id === currentAgentId}
              onClick={() => navigate(`/agents?type=${agent.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface AgentNavItemProps {
  agent: AgentConfig;
  isActive: boolean;
  onClick: () => void;
}

function AgentNavItem({ agent, isActive, onClick }: AgentNavItemProps) {
  const Icon = agent.icon;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
        isActive
          ? 'bg-white shadow-sm border border-gray-200'
          : 'hover:bg-white/60'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg ${agent.bgColor} flex items-center justify-center`}
      >
        <Icon className={`w-4 h-4 ${agent.color}`} />
      </div>
      <span
        className={`text-sm ${isActive ? 'font-medium text-gray-900' : 'text-gray-600'}`}
      >
        {agent.name}
      </span>
    </button>
  );
}
