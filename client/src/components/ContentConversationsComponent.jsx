import React, { useRef, useState, useEffect } from 'react';
import { Trash2, SendHorizontal } from 'lucide-react';
import carmodel from '@/assets/carmodel.jpg';
import background from '@/assets/backgroundMessages.png';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from 'react-redux';
import { useDeleteConversationMutation } from '@/redux/slices/apiSlice';


const ContentConversationsComponent = ({ socket, conversationId, conversation, messages, setMessages }) => {

  const [message, setMessage] = useState('');
  const [lastTime, setLastTime] = useState('');
  const textareaRef = useRef(null);
  const maxLength = 1000;
  const navigate = useNavigate();
  console.log("Here:",conversation)
  const currentUserId = useSelector(state=>state.user.userData.id);
  const [deleteConversation] = useDeleteConversationMutation();



  const formatEuro = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  useEffect(() => {
    const messagesEnd = document.getElementById('messagesEnd');
    if (messagesEnd) {
      messagesEnd.scrollIntoView({ behavior: 'smooth' });
    };
  }, [messages]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage) => {
        if (newMessage.conversation_id === conversationId) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      };

      socket.on('new_message', handleNewMessage);

      return () => {
        socket.off('new_message', handleNewMessage);
      };
    }
  }, [socket, conversationId, setMessages]);

  const handleSendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = {
      conversationId,
      message: message.trim(),
    };

    console.log('Emitting send_message', { conversationId, message });
    socket.emit('send_message', newMessage);


    setMessage('');
  };

  const handleKeyDown = (e) => { 
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className='h-32 w-full flex flex-col'>
        <div className='h-16 w-full flex flex-row justify-between p-4 border-b-[1px] border-gray-200'>
          <div className='flex flex-row gap-5 items-center'>
            <Avatar className='cursor-pointer'>
                <AvatarImage />
                <AvatarFallback className='bg-black text-white font-bold text-lg'>{conversation?.buyer_username?.toUpperCase().slice(0,1)|| conversation?.seller_username?.toUpperCase().slice(0,1) || 'U'}</AvatarFallback>
            </Avatar>
            <h3>{conversation?.buyer_username || conversation?.seller_username}</h3>
          </div>
          <button className='hover:text-red-500' onClick={()=>{deleteConversation(conversation.id); window.location.reload()}}>
            <Trash2 size={25} />
          </button>
        </div>

        <div className='h-16 w-full border-b-[1px] border-gray-200 flex flex-row items-center px-4 gap-4
        cursor-pointer' onClick={()=>navigate(`/cars/${conversation?.car_id}`)}>
        <img
          src={conversation?.image_urls[0]}
          alt="Post"
          className="h-12 w-16 object-cover rounded-sm"
        />
          <div className='flex flex-col items-start justify-between py-2'>
            <p className='text-sm'>{conversation?.post_title}</p> 
            <p className='font-bold text-sm'>{formatEuro(conversation?.price)}</p> 
          </div>
        </div>
      </div>

      <div 
        className='flex-1 min-h-[34rem] max-h-[34rem] w-full bg-cover bg-center'
        style={{ backgroundImage: `url(${background})` }}
      >
        <div 
          className='w-full h-full bg-black/10 overflow-auto scrollbar-hide hover:scrollbar-default 
                     [&::-webkit-scrollbar]:w-2
                     [&::-webkit-scrollbar-track]:bg-gray-100
                     [&::-webkit-scrollbar-thumb]:bg-gray-300
                     [&::-webkit-scrollbar-thumb]:rounded-full
                     hover:[&::-webkit-scrollbar-thumb]:bg-gray-400'
        >
          {messages.map((msg, index) => {
            const isCurrentUser = msg.sender_id === currentUserId;
            const showTime = index === 0 || new Date(messages[index - 1].created_at).getHours() !== new Date(msg.created_at).getHours();

            return (
              <div key={msg.id} className="space-y-1 p-1">
                {showTime && (
                  <div className="flex justify-center">
                    <span className="text-xs bg-black/80 text-white px-2 py-1 rounded-full">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                <div className={`w-full flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] break-words ${
                      isCurrentUser 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white text-gray-900'
                    } px-4 py-2 rounded-2xl`}>
                    <p>{msg.message}</p>
                    <span className="text-xs opacity-70 float-right ml-2 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
          <div id="messagesEnd" />
        </div>
      </div>

      <div className='min-h-12 max-h-40 flex flex-row items-center px-2'>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          maxLength={maxLength}
          rows={1}
          className="w-full resize-none rounded border-gray-200 
                     min-h-20 max-h-full py-2 px-3 text-base bg-transparent flex-1 focus:outline-none scrollbar-hide hover:scrollbar-default 
                     [&::-webkit-scrollbar]:w-2
                     [&::-webkit-scrollbar-track]:bg-gray-100
                     [&::-webkit-scrollbar-thumb]:bg-gray-300
                     [&::-webkit-scrollbar-thumb]:rounded-full
                     hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
        />

        <button 
          className='rounded-full bg-red-500 text-white p-2 ml-2' 
          onClick={handleSendMessage}
        >
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}

export default ContentConversationsComponent;
