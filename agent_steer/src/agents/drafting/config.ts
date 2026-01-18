import { FileEdit } from 'lucide-react'
import type { AgentConfig } from '../types'

export const draftingAgentConfig: AgentConfig = {
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
}
