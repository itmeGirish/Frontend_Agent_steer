import { useState, useEffect } from 'react';
import { CopilotSidebar, type CopilotKitCSSProperties } from '@copilotkit/react-ui';
import { useWorkflowTools, useFrontendTools } from '../hooks';

// Suggestions for the chat sidebar
const CHAT_SUGGESTIONS = [
  {
    title: 'Start Workflow',
    message: 'Start the job application workflow.',
  },
  {
    title: 'Set Theme',
    message: 'Set the theme to blue.',
  },
  {
    title: 'Help',
    message: 'What can you help me with?',
  },
];

export function CopilotChatContent() {
  const [themeColor, setThemeColor] = useState('#6366f1');

  // Register frontend tools
  useFrontendTools({
    onThemeChange: setThemeColor,
  });

  // Register workflow tools
  useWorkflowTools({ themeColor });

  // Suppress CopilotKit console errors (known issue)
  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const shouldSuppress = (args: unknown[]): boolean => {
      const errorString = args
        .map((arg) => {
          if (typeof arg === 'object' && arg !== null) {
            try {
              return JSON.stringify(arg);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(' ');
      return (
        errorString.includes('toolCallId') ||
        (errorString.includes('invalid_type') && errorString.includes('Required'))
      );
    };

    console.error = (...args: unknown[]) => {
      if (shouldSuppress(args)) return;
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args: unknown[]) => {
      if (shouldSuppress(args)) return;
      originalConsoleWarn.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  // Hide CopilotKit version banner
  useEffect(() => {
    const hideBanner = () => {
      const allElements = document.querySelectorAll('div, span, a');
      allElements.forEach((el) => {
        if (
          el.textContent?.includes('CopilotKit v') &&
          el.textContent?.includes('now live')
        ) {
          let parent = el.parentElement;
          while (parent && parent.tagName !== 'BODY') {
            if (parent.children.length <= 3) {
              (parent as HTMLElement).style.display = 'none';
              return;
            }
            parent = parent.parentElement;
          }
          (el as HTMLElement).style.display = 'none';
        }
      });
    };

    hideBanner();
    const timer1 = setTimeout(hideBanner, 100);
    const timer2 = setTimeout(hideBanner, 500);
    const timer3 = setTimeout(hideBanner, 1000);

    const observer = new MutationObserver(hideBanner);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      observer.disconnect();
    };
  }, []);

  return (
    <main
      style={
        { '--copilot-kit-primary-color': themeColor } as CopilotKitCSSProperties
      }
      className="h-screen"
    >
      <CopilotSidebar
        disableSystemMessage={true}
        clickOutsideToClose={false}
        labels={{
          title: 'Genspark AI Assistant',
          initial: "Hi! I'm your AI assistant. I can help you with job applications and more.",
        }}
        suggestions={CHAT_SUGGESTIONS}
      >
        <MainContent themeColor={themeColor} />
      </CopilotSidebar>
    </main>
  );
}

interface MainContentProps {
  themeColor: string;
}

function MainContent({ themeColor }: MainContentProps) {
  return (
    <div
      className="h-screen flex flex-col justify-center items-center transition-colors duration-300"
      style={{ backgroundColor: themeColor }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Genspark AI Workspace
        </h1>
        <p className="text-gray-600 mb-6">
          Use the chat sidebar to interact with the AI assistant.
          Try starting a job application workflow!
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
            Multi-Step Workflows
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            AI Powered
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Dynamic Forms
          </span>
        </div>
      </div>
    </div>
  );
}
