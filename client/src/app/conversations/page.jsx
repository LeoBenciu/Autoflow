import React from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import ConversationsListComponent from '@/components/ConversationsListComponent'
import ContentConversationsComponent from '@/components/ContentConversationsComponent'


const ConversationsPage = () => {

  return (
    <div className=' container min-w-screen-2xl max-w-screen-2xl min-h-max bg-[var(--background)] mx-auto px-24 flex flex-row items-center justify-center'>
    <div className='bg-white min-w-[1200px] max-w-[1200px] min-h-[750px] max-h-[750px] mt-10
    rounded-lg'>
      <ResizablePanelGroup
      direction="horizontal"
      className=" max-w-full rounded-lg border md:min-w-[450px] min-h-[750px] max-h-[750px]"
       >
      <ResizablePanel defaultSize={30} minSize={30}>
        <ConversationsListComponent />
      </ResizablePanel>
      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={75} minSize={50}>
        <ContentConversationsComponent/>
      </ResizablePanel>

    </ResizablePanelGroup>

    </div>
    </div>
  )
}

export default ConversationsPage
