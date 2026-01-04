export interface Model {
  /** Model ID */
  id: string
  /** Display name */
  name: string
  /** Model description */
  description?: string
}

export interface ChatHeaderProps {
  /** Chat title */
  title?: string
  /** Available models */
  models: Model[]
  /** Currently selected model ID */
  selectedModelId: string
  /** Callback when model is changed */
  onModelChange: (modelId: string) => void
  /** Callback to toggle sidebar */
  onToggleSidebar?: () => void
  /** Callback to share chat */
  onShare?: () => void
  /** Callback to export chat */
  onExport?: () => void
  /** Callback to delete chat */
  onDelete?: () => void
  /** Is sidebar collapsed */
  isSidebarCollapsed?: boolean
}