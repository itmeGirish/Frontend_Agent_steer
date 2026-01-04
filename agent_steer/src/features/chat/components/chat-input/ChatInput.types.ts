export interface ChatInputProps {
  /** Callback when message is sent */
  onSend: (message: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Disable input and button */
  disabled?: boolean
  /** Show loading state */
  isLoading?: boolean
}