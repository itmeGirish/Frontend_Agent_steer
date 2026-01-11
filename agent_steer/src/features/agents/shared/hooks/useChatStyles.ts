import { useEffect } from 'react';

/**
 * Hook to inject chat scrollbar and input styles
 */
export function useChatStyles() {
  useEffect(() => {
    const styleId = 'copilotkit-chat-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* Input controls */
        .copilotKitInputControls, [class*="copilotKitInputControls"] {
          flex-wrap: wrap !important;
          gap: 8px !important;
        }
        /* Scrollbar for chat messages */
        .copilotKitMessages,
        [class*="copilotKitMessages"],
        [class*="Messages"],
        [class*="messagesContainer"],
        [class*="chatMessages"],
        [class*="ChatMessages"],
        [data-chat-messages],
        .copilotKitWindow > div:first-child,
        [class*="copilotKitWindow"] > div:first-child {
          overflow-y: auto !important;
          max-height: calc(100vh - 200px) !important;
          scrollbar-width: thin !important;
          scrollbar-color: #888 #f1f1f1 !important;
        }
        /* Webkit scrollbar */
        .copilotKitMessages::-webkit-scrollbar,
        [class*="copilotKitMessages"]::-webkit-scrollbar,
        [class*="Messages"]::-webkit-scrollbar,
        [class*="messagesContainer"]::-webkit-scrollbar,
        .copilotKitWindow > div:first-child::-webkit-scrollbar,
        [class*="copilotKitWindow"] > div:first-child::-webkit-scrollbar {
          width: 8px !important;
        }
        .copilotKitMessages::-webkit-scrollbar-track,
        [class*="copilotKitMessages"]::-webkit-scrollbar-track,
        [class*="Messages"]::-webkit-scrollbar-track,
        [class*="messagesContainer"]::-webkit-scrollbar-track,
        .copilotKitWindow > div:first-child::-webkit-scrollbar-track,
        [class*="copilotKitWindow"] > div:first-child::-webkit-scrollbar-track {
          background: #f1f1f1 !important;
          border-radius: 4px !important;
        }
        .copilotKitMessages::-webkit-scrollbar-thumb,
        [class*="copilotKitMessages"]::-webkit-scrollbar-thumb,
        [class*="Messages"]::-webkit-scrollbar-thumb,
        [class*="messagesContainer"]::-webkit-scrollbar-thumb,
        .copilotKitWindow > div:first-child::-webkit-scrollbar-thumb,
        [class*="copilotKitWindow"] > div:first-child::-webkit-scrollbar-thumb {
          background-color: #888 !important;
          border-radius: 4px !important;
        }
        .copilotKitMessages::-webkit-scrollbar-thumb:hover,
        [class*="copilotKitMessages"]::-webkit-scrollbar-thumb:hover,
        [class*="Messages"]::-webkit-scrollbar-thumb:hover,
        [class*="messagesContainer"]::-webkit-scrollbar-thumb:hover,
        .copilotKitWindow > div:first-child::-webkit-scrollbar-thumb:hover,
        [class*="copilotKitWindow"] > div:first-child::-webkit-scrollbar-thumb:hover {
          background-color: #555 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
}
