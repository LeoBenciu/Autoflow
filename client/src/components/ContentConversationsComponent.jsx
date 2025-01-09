import React, { useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import carmodel from '@/assets/carmodel.jpg'
import { SendHorizontal } from 'lucide-react'
import background from '@/assets/backgroundMessages.png'

const ContentConversationsComponent = () => {

    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);
    const maxLength = 1000;
    const currentUser= 'Mario';

    const messages=[
        {content:'Hello',
        sender:'Mario',
        receiver:'Luigi',
        time:'12:00'},
        {content:'Hi',
        sender:'Luigi', 
        receiver:'Mario',
        time:'12:01'},
        {content:'How are you?',
        sender:'Mario',
        receiver:'Luigi',
        time:'12:02'},
        {content:'I am fine',
        sender:'Luigi',
        receiver:'Mario',
        time:'12:03'},
        {content:'How about you?',
        sender:'Luigi',
        receiver:'Mario',
        time:'12:04'},
        {content:'I am fine too',
        sender:'Mario',
        receiver:'Luigi',
        time:'12:05'},
        {content:'Good to hear that',
        sender:'Luigi',
        receiver:'Mario',
        time:'12:06'},
        {content:'Yes',
        sender:'Mario',
        receiver:'Luigi',
        time:'12:07'},
        {content:'I am fine too2',
            sender:'Mario',
            receiver:'Luigi',
            time:'12:05'},
        {content:'Yes',
            sender:'Mario',
            receiver:'Luigi',
            time:'12:07'},
        {content:'Yes',
            sender:'Mario',
            receiver:'Luigi',
            time:'12:07'},

    ].sort((a,b)=>{
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return(timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });
    
    const handleKeyDown = (e) => { 
        e.prevent.default();
    };

  return (
    <div className="flex h-full flex-col">
          <div className='h-32 w-full flex flex-col'>
            <div className='h-16 w-full flex flex-row justify-between p-4 border-b-[1px] border-gray-200'>
              <div className='flex flex-row gap-5 items-center'>
                <img src="https://github.com/shadcn.png" className='size-10 rounded-full'/>
                <h3>Username</h3>
              </div>
              <button className='hover:text-red-500'>
                <Trash2 size={25}/>
              </button>
            </div>

            <div className='h-16 w-full border-b-[1px] border-gray-200 flex flex-row items-center px-4 gap-4'>
              <img src={carmodel} className='h-12 w-16 object-cover rounded-sm'></img>
              <div className='flex flex-col items-start justify-between py-2'>
                <p className='text-sm'>Post Title</p>
                <p className='font-bold text-sm'>45.600€</p>
              </div>
            </div>
          </div>

          <div className='flex-1 min-h-[34rem] max-h-[34rem] w-full  bg-cover bg-center'
          style={{ backgroundImage: `url(${background})` }}>
            <div className='w-full h-full bg-black/10 overflow-auto crollbar-hide hover:scrollbar-default 
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-gray-100
                        [&::-webkit-scrollbar-thumb]:bg-gray-300
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-gray-400'>
                {messages.map((message, index)=>{
                    const isCurrentUser = message.sender === currentUser;
                    const showTime = index === 0 || messages[index - 1].time.split(':')[0] !== message.time.split(':')[0];

                    return(
                        <div key={index} className="space-y-1 p-1">
                        {showTime && (
                            <div className="flex justify-center">
                                <span className="text-xs bg-black/80 text-white px-2 py-1 rounded-full">
                                    {message.time}
                                </span>
                            </div>
                        )}
                        <div className={`w-full flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] break-words ${
                                isCurrentUser 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-white text-gray-900'
                            } px-4 py-2 rounded-2xl`}>
                                <p>{message.content}</p>
                                <span className="text-xs opacity-70 float-right ml-2 mt-1">
                                    {message.time}
                                </span>
                            </div>
                        </div>
                    </div>
            )})}
            </div>
          </div>

            <div className=' min-h-12 max-h-40 flex flex-row items-center px-2'>
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  maxLength={maxLength}
                  rows={1}
                  className="w-full resize-none rounded border-gray-200 
                             min-h-20  max-h-full py-2 px-3 text-base bg-transparent flex-1 focus:outline-none scrollbar-hide hover:scrollbar-default 
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-gray-100
                        [&::-webkit-scrollbar-thumb]:bg-gray-300
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"/>

                <button className='rounded-full bg-red-500 text-white p-2'><SendHorizontal size={20}/></button>
            </div>
        </div>
  )
}

export default ContentConversationsComponent
