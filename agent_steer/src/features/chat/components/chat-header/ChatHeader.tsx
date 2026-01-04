import { useState, useRef, useEffect } from 'react'
import { cn } from '../../../../utils/cn'
import type { ChatHeaderProps } from './ChatHeader.types'
import { 
  PanelLeft, 
  ChevronDown, 
  Share2, 
  Download, 
  Trash2,
  MoreVertical,
  Check,
  Sparkles
} from 'lucide-react'

export function ChatHeader({
  title = 'New Chat',
  models,
  selectedModelId,
  onModelChange,
  onToggleSidebar,
  onShare,
  onExport,
  onDelete,
  isSidebarCollapsed = false,
}: ChatHeaderProps) {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false)
  const modelDropdownRef = useRef<HTMLDivElement>(null)
  const actionsDropdownRef = useRef<HTMLDivElement>(null)

  // Get selected model
  const selectedModel = models.find((m) => m.id === selectedModelId)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        setIsModelDropdownOpen(false)
      }
      if (
        actionsDropdownRef.current &&
        !actionsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsActionsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Toggle sidebar button */}
        {onToggleSidebar && isSidebarCollapsed && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Open sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}

        {/* Model selector dropdown */}
        <div className="relative" ref={modelDropdownRef}>
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg',
              'bg-slate-800 border border-slate-700',
              'text-slate-100 hover:bg-slate-700 transition-colors'
            )}
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="font-medium">{selectedModel?.name || 'Select Model'}</span>
            <ChevronDown className={cn(
              'w-4 h-4 text-slate-400 transition-transform',
              isModelDropdownOpen && 'rotate-180'
            )} />
          </button>

          {/* Model dropdown menu */}
          {isModelDropdownOpen && (
            <div className={cn(
              'absolute top-full left-0 mt-2 w-64 z-50',
              'bg-slate-800 border border-slate-700 rounded-lg shadow-xl',
              'py-1 overflow-hidden'
            )}>
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id)
                    setIsModelDropdownOpen(false)
                  }}
                  className={cn(
                    'flex items-center justify-between w-full px-4 py-3',
                    'text-left hover:bg-slate-700 transition-colors',
                    selectedModelId === model.id
                      ? 'text-white bg-slate-700/50'
                      : 'text-slate-300'
                  )}
                >
                  <div>
                    <p className="font-medium">{model.name}</p>
                    {model.description && (
                      <p className="text-sm text-slate-500">{model.description}</p>
                    )}
                  </div>
                  {selectedModelId === model.id && (
                    <Check className="w-4 h-4 text-blue-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat title */}
        <h1 className="text-slate-400 font-medium hidden sm:block">
          {title}
        </h1>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-2">
        {/* Share button (desktop) */}
        {onShare && (
          <button
            onClick={onShare}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        )}

        {/* More actions dropdown */}
        <div className="relative" ref={actionsDropdownRef}>
          <button
            onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="More actions"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Actions dropdown menu */}
          {isActionsDropdownOpen && (
            <div className={cn(
              'absolute top-full right-0 mt-2 w-48 z-50',
              'bg-slate-800 border border-slate-700 rounded-lg shadow-xl',
              'py-1 overflow-hidden'
            )}>
              {/* Share (mobile) */}
              {onShare && (
                <button
                  onClick={() => {
                    onShare()
                    setIsActionsDropdownOpen(false)
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors sm:hidden"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              )}

              {/* Export */}
              {onExport && (
                <button
                  onClick={() => {
                    onExport()
                    setIsActionsDropdownOpen(false)
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Chat</span>
                </button>
              )}

              {/* Delete */}
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete()
                    setIsActionsDropdownOpen(false)
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Chat</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}