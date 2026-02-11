import { MessageCircle, Users, FileEdit } from 'lucide-react'
import type { AgentConfig } from '../types'

// Single source of truth for broadcasting user ID — change here to update everywhere
export const BROADCAST_USER_ID = 'user1'

export const whatsappAgentConfig: AgentConfig = {
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
}
