'use client';

import { usePathname } from 'next/navigation';
import ChatBubble from '@/components/ChatBubble';

export default function ChatVisibilityController() {
  const pathname = usePathname();
  const isAssistantOpen = Boolean(pathname?.startsWith('/assistant'));

  return <ChatBubble isVisible={!isAssistantOpen} />;
}
