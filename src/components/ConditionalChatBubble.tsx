'use client';

import { usePathname } from 'next/navigation';
import ChatBubble from '@/components/ChatBubble';

export default function ConditionalChatBubble() {
  const pathname = usePathname();

  if (pathname?.startsWith('/assistant')) {
    return null;
  }

  return <ChatBubble />;
}
