import { useState } from 'react'
import { cn } from '../../../../utils/cn'
import type { ChatHeaderProps } from './ChatHeader.types'
import { 
  ChevronDown,
  PanelLeft,
  SquarePen,
  Share
} from 'lucide-react'

export function ChatHeader({
  models,
  selectedModelId,
  onModelChange,
  onToggleSidebar,
  isSidebarCollapsed,
  onShare,
}: ChatHeaderProps) {
  const [isModelOpen, setIsModelOpen] = useState(false)
  
  const selectedModel = models.find((m) => m.id === selectedModelId)

  return (
    <header className="flex items-center justify-between px-3 py-2 bg-white">
      {/* Left section */}
      <div className="flex items-center gap-1">
        {isSidebarCollapsed && (
          <>
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Open sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {}}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="New chat"
            >
              <SquarePen className="w-5 h-5" />
            </button>
          </>
        )}
        
        {/* Model Selector */}
        <div className="relative">
          <button
            onClick={() => setIsModelOpen(!isModelOpen)}
            className={cn(
              'flex items-center gap-1 px-3 py-2 rounded-lg',
              'text-gray-800 hover:bg-gray-100 transition-colors',
              'font-semibold'
            )}
          >
            {selectedModel?.name || 'Select Model'}
            <ChevronDown className={cn(
              'w-4 h-4 text-gray-500 transition-transform',
              isModelOpen && 'rotate-180'
            )} />
          </button>

          {isModelOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsModelOpen(false)} 
              />
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-2">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model.id)
                      setIsModelOpen(false)
                    }}
                    className={cn(
                      'w-full px-4 py-3 text-left',
                      'hover:bg-gray-50 transition-colors',
                      selectedModelId === model.id && 'bg-gray-50'
                    )}
                  >
                    <div className="font-medium text-gray-900">{model.name}</div>
                    <div className="text-sm text-gray-500">{model.description}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        {onShare && (
          <button
            onClick={onShare}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Share className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>
        )}
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-medium">
          G
        </div>
      </div>
    </header>
  )
}