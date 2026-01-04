export interface QuickPrompt {
  /** Unique ID */
  id: string
  /** Icon name or emoji */
  icon: string
  /** Prompt title */
  title: string
  /** Prompt text to send */
  prompt: string
}

export interface EmptyStateProps {
  /** User's name for greeting */
  userName?: string
  /** Quick prompt suggestions */
  quickPrompts?: QuickPrompt[]
  /** Callback when a quick prompt is clicked */
  onPromptClick: (prompt: string) => void
}