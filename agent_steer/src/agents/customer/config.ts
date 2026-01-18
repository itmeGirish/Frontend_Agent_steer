import { Users } from 'lucide-react'
import type { AgentConfig } from '../types'

export const customerAgentConfig: AgentConfig = {
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
}
