import React from 'react';
import carmodel from '@/assets/carmodel.jpg';
import { Trash2 } from 'lucide-react';
import { useDeleteConversationMutation } from '@/redux/slices/apiSlice';

const ConversationComponent = ({ conversation, onSelectConversation }) => {
  const handleClick = () => {
    onSelectConversation(conversation.id);
  };

  console.log(conversation.id)
  const [deleteConversation] = useDeleteConversationMutation(conversation.id);



  return (
    <div 
      className='flex flex-row items-center justify-start w-full h-20 min-h-16 max-h-16 mb-4 rounded-md px-3
      border-[1px] border-gray-200 relative cursor-pointer hover:bg-red-100'
      onClick={handleClick}
    >
      <img 
        src={conversation?.image_urls?.[0] || carmodel} 
        alt="Post" 
        className='rounded-full size-12 object-cover' 
      />
      <div className='flex flex-col items-start justify-center ml-2 flex-1'>
        <h3 className='font-bold text-black text-left'>
          {conversation.post_title}
        </h3>
      </div>
      <div className='flex flex-col justify-between items-center w-12'>
        <button
          className='hover:text-red-500'
          onClick={(e) => {deleteConversation(conversation.id); window.location.reload()}}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default ConversationComponent;
