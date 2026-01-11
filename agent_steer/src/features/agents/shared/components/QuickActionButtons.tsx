import { useEffect } from 'react';
import type { AgentAction } from '@/config/agents';
import { sendMessageToChat } from '@/features/copilot/hooks/useChatHelpers';

interface QuickActionButtonsProps {
  actions: AgentAction[];
  themeColor: string;
  maxButtons?: number;
}

/**
 * Injects quick action buttons into CopilotKit input bar
 */
export function QuickActionButtons({
  actions,
  themeColor,
  maxButtons = 3
}: QuickActionButtonsProps) {
  useEffect(() => {
    const injectButtons = () => {
      const inputContainer = document.querySelector(
        '[class*="copilotKitInput"], .copilotKitInput, [class*="InputArea"]'
      );

      if (!inputContainer) return;
      if (document.getElementById('quick-action-buttons')) return;

      const buttonsDiv = document.createElement('div');
      buttonsDiv.id = 'quick-action-buttons';
      buttonsDiv.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 8px 12px;
        border-bottom: 1px solid #e5e7eb;
      `;

      actions.slice(0, maxButtons).forEach((action) => {
        const btn = document.createElement('button');
        btn.textContent = action.label;
        btn.style.cssText = `
          padding: 6px 12px;
          font-size: 12px;
          border-radius: 9999px;
          border: 2px solid ${themeColor};
          color: ${themeColor};
          background: white;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        `;
        btn.onmouseenter = () => {
          btn.style.background = themeColor;
          btn.style.color = 'white';
        };
        btn.onmouseleave = () => {
          btn.style.background = 'white';
          btn.style.color = themeColor;
        };
        btn.onclick = () => sendMessageToChat(action.prompt);
        buttonsDiv.appendChild(btn);
      });

      inputContainer.insertBefore(buttonsDiv, inputContainer.firstChild);
    };

    injectButtons();
    const t1 = setTimeout(injectButtons, 200);
    const t2 = setTimeout(injectButtons, 500);
    const t3 = setTimeout(injectButtons, 1000);

    const observer = new MutationObserver(() => {
      if (!document.getElementById('quick-action-buttons')) {
        injectButtons();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      observer.disconnect();
      document.getElementById('quick-action-buttons')?.remove();
    };
  }, [actions, themeColor, maxButtons]);

  return null;
}
