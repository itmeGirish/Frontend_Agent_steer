import {
  Users,
  MessageCircle,
  FileEdit,
  Scale,
  type LucideIcon
} from 'lucide-react';

// Agent action types
export type AgentActionType =
  | 'onboarding'
  | 'job_application'
  | 'customer_support'
  | 'document_draft'
  | 'legal_review'
  | 'message_template'
  | 'broadcast'
  | 'analytics';

// Agent action configuration
export interface AgentAction {
  id: AgentActionType;
  label: string;
  description: string;
  icon: LucideIcon;
  prompt: string; // The prompt to send to CopilotKit
}

// Agent configuration
export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  actions: AgentAction[];
  copilotAgentName: string; // LangGraph agent name
}

// Agent registry - add new agents here
export const AGENTS: Record<string, AgentConfig> = {
  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp Agent',
    description: 'Automate WhatsApp business communications, onboarding, and customer engagement',
    icon: MessageCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    copilotAgentName: 'sample_agent',
    actions: [
      {
        id: 'onboarding',
        label: 'Onboarding Flow',
        description: 'Start user onboarding workflow',
        icon: Users,
        prompt: 'Start the onboarding workflow for a new user.',
      },
      {
        id: 'job_application',
        label: 'Job Application',
        description: 'Start job application workflow',
        icon: FileEdit,
        prompt: 'Start the job application workflow.',
      },
      {
        id: 'message_template',
        label: 'Message Templates',
        description: 'Create and manage message templates',
        icon: MessageCircle,
        prompt: 'Help me create a WhatsApp message template.',
      },
      {
        id: 'broadcast',
        label: 'Broadcast',
        description: 'Send broadcast messages',
        icon: Users,
        prompt: 'Help me set up a broadcast message campaign.',
      },
    ],
  },
  customer: {
    id: 'customer',
    name: 'Customer Proactive Agent',
    description: 'Proactive customer engagement and support automation',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    copilotAgentName: 'sample_agent',
    actions: [
      {
        id: 'customer_support',
        label: 'Support Ticket',
        description: 'Handle customer support requests',
        icon: Users,
        prompt: 'Help me create a customer support ticket workflow.',
      },
      {
        id: 'onboarding',
        label: 'Customer Onboarding',
        description: 'Onboard new customers',
        icon: Users,
        prompt: 'Start the customer onboarding process.',
      },
    ],
  },
  drafting: {
    id: 'drafting',
    name: 'Drafting Agent',
    description: 'AI-powered document drafting and editing',
    icon: FileEdit,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    copilotAgentName: 'sample_agent',
    actions: [
      {
        id: 'document_draft',
        label: 'New Document',
        description: 'Create a new document draft',
        icon: FileEdit,
        prompt: 'Help me draft a new document.',
      },
    ],
  },
  law: {
    id: 'law',
    name: 'Law Agent',
    description: 'Legal document analysis and review assistance',
    icon: Scale,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    copilotAgentName: 'sample_agent',
    actions: [
      {
        id: 'legal_review',
        label: 'Legal Review',
        description: 'Review legal documents',
        icon: Scale,
        prompt: 'Help me review a legal document.',
      },
    ],
  },
};

// Helper to get agent by ID
export function getAgentById(id: string): AgentConfig | undefined {
  return AGENTS[id];
}

// Get all agents as array
export function getAllAgents(): AgentConfig[] {
  return Object.values(AGENTS);
}
