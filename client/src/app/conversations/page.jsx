import React, { useEffect, useState } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import ConversationsListComponent from '@/components/ConversationsListComponent';
import ContentConversationsComponent from '@/components/ContentConversationsComponent';
import { io } from 'socket.io-client';

import {
  useGetBuyConversationsQuery,
  useGetSellConversationsQuery,
  useGetConversationMessagesQuery,
} from '@/redux/slices/apiSlice';

const ConversationsPage = () => {
  const [socket, setSocket] = useState(null);

  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const [messages, setMessages] = useState([]);

  const [conversationDetails, setConversationDetails] = useState(null);

  const { data: buyConversations } = useGetBuyConversationsQuery();
  const { data: sellConversations } = useGetSellConversationsQuery();

  const { data: conversationMessages } = useGetConversationMessagesQuery(
    selectedConversationId,
    { skip: !selectedConversationId }
  );

  useEffect(() => {
    if (conversationMessages) {
      setMessages(conversationMessages);
    } else {
      setMessages([]);
    }
  }, [conversationMessages]);

  useEffect(() => {
    const socketConnection = io('https://autoflow-nnn5.onrender.com', {
      withCredentials: true,
    });

    setSocket(socketConnection);

    socketConnection.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketConnection.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socketConnection.on('new_message', (message) => {
      console.log('New message received:', message);

      if (message.conversation_id === selectedConversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && selectedConversationId) {
      socket.emit('join_conversation', selectedConversationId);

      return () => {
        socket.emit('leave_conversation', selectedConversationId);
      };
    }
  }, [socket, selectedConversationId]);


  const handleConversationSelect = (conversationId) => {
    const numericId = Number(conversationId);
    setSelectedConversationId(numericId);
  
    let found = null;
    if (buyConversations) {
      found = buyConversations.find((c) => Number(c.id) === numericId);
    }
    if (!found && sellConversations) {
      found = sellConversations.find((c) => Number(c.id) === numericId);
    }
  
    setConversationDetails(found || null);
  };

  return (
    <div className='container min-w-screen-2xl max-w-screen-2xl min-h-max bg-[var(--background)] mx-auto px-24 flex flex-row items-center justify-center'>
      <div className='bg-white min-w-[1200px] max-w-[1200px] min-h-[750px] max-h-[750px] mt-10 rounded-lg'>
        <ResizablePanelGroup
          direction='horizontal'
          className='max-w-full rounded-lg border md:min-w-[450px] min-h-[750px] max-h-[750px]'
        >
          <ResizablePanel defaultSize={30} minSize={30}>
            <ConversationsListComponent
              conversations={{ buyConversations, sellConversations }}
              onSelectConversation={handleConversationSelect}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75} minSize={50}>
            {selectedConversationId ? (
              <ContentConversationsComponent
                socket={socket}
                conversationId={selectedConversationId}
                conversation={conversationDetails}
                messages={messages}
                setMessages={setMessages}
              />
            ) : (
              <div className='flex items-center justify-center h-full text-gray-500'>
                Select a conversation to start chatting
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ConversationsPage;
