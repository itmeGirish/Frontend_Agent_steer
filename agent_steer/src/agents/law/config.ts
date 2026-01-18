import { Scale } from 'lucide-react'
import type { AgentConfig } from '../types'

export const lawAgentConfig: AgentConfig = {
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
}
