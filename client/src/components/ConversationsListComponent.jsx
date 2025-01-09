import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ConversationComponent from '@/components/ConversationComponent'
import noMessages from '@/assets/noMessages.svg'

const ConversationsListComponent = () => {

    const conversations = [
        {},{},{},{},{},{},{},{},{},{},{},{},{}
      ];
  return (
    <div className="flex h-full w-full items-start justify-start p-6">
    <Tabs defaultValue="account" className="w-full flex flex-col items-start h-full">
      <TabsList className='bg-transparent mb-4'>
        <TabsTrigger value="account" className='bg-white data-[state=active]:bg-red-500 data-[state=active]:text-white
        data-[state=active]:font-bold'>To buy</TabsTrigger>
        <TabsTrigger value="password" className='bg-white data-[state=active]:bg-red-500 data-[state=active]:text-white
        data-[state=active]:font-bold'>To sell</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="flex flex-col items-start min-h-[90%] max-h-[90%] min-w-full data-[state=inactive]:hidden">
        <div className="flex flex-col items-start bg-white min-h-[90%] min-w-full overflow-y-auto scrollbar-hide hover:scrollbar-default 
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-gray-100
                        [&::-webkit-scrollbar-thumb]:bg-gray-300
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 p-2">
          {conversations.length>0&&(
            conversations.map((conversation)=>(
            <ConversationComponent/>
          )))}
          {conversations.length===0&&(
            <div className='flex flex-col items-center justify-center min-w-full'>
              <img src={noMessages} className='size-36'></img>
              <h3 className='font-bold text-xl'>There are no ongoing conversations at this time.</h3>
              <p className='mt-3'>When you start a conversation with a seller, it appears here.</p>
            </div>
          )}
        </div>
      </TabsContent>
       
      <TabsContent value="password" className="flex flex-col items-start min-h-[90%] max-h-[90%] min-w-full">
      <div className="flex flex-col items-start bg-white min-h-[90%] min-w-full overflow-y-auto scrollbar-hide hover:scrollbar-default 
                        [&::-webkit-scrollbar]:w-2
                        [&::-webkit-scrollbar-track]:bg-gray-100
                        [&::-webkit-scrollbar-thumb]:bg-gray-300
                        [&::-webkit-scrollbar-thumb]:rounded-full
                        hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 p-2">
          {conversations.length>0&&(
            conversations.map((conversation)=>(
            <ConversationComponent/>
          )))}
          {conversations.length===0&&(
            <div className='flex flex-col items-center justify-center min-w-full'>
              <img src={noMessages} className='size-36'></img>
              <h3 className='font-bold text-xl'>There are no ongoing conversations at this time.</h3>
              <p className='mt-3'>When you start a conversation with a seller, it appears here.</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  </div>
  )
}

export default ConversationsListComponent
