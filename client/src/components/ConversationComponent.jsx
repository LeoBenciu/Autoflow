import React from 'react'
import postImage from '@/assets/carmodel.jpg'
import {Trash2} from 'lucide-react'


const ConversationComponent = () => {


  return (
    <div className='flex flex-row items-center justify-start min-w-full h-20 min-h-16 max-h-16 mb-1 rounded-md px-3
    border-[1px] border-gray-200 relative cursor-pointer hover:bg-red-100'>
      <img src={postImage} className='rounded-full size-12 object-cover'/>
        <div className='flex flex-col items-start justify-center ml-2 flex-1'>
            <h3 className='font-bold text-black'>Username</h3>
            <p className='text-gray-700'>Post Title</p>
        </div>
        <div className='flex flex-col justify-between items-center min-w-12 max-w-12'>
            <p className='text-gray-700'>13:09</p>
            <button
                className='hover:text-red-500'
            ><Trash2  size={15}/></button>
        </div>
    </div>
  )
}

export default ConversationComponent
