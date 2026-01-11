import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AgentConfig } from '@/config/agents';

interface AgentHeaderProps {
  agent: AgentConfig;
}

export function AgentHeader({ agent }: AgentHeaderProps) {
  const navigate = useNavigate();
  const Icon = agent.icon;

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white">
      <button
        onClick={() => navigate('/chat')}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>

      <div className={`w-10 h-10 rounded-xl ${agent.bgColor} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${agent.color}`} />
      </div>

      <div>
        <h1 className="font-semibold text-gray-900">{agent.name}</h1>
        <p className="text-xs text-gray-500">{agent.description}</p>
      </div>
    </div>
  );
}
