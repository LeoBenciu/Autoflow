import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SlidersHorizontal } from 'lucide-react';
import { History } from 'lucide-react';


const FilterTabs = ({content1, content2}) => {
  return (
    <Tabs defaultValue="login" className="min-w-full max-h-max mx-auto bg-transparent flex flex-row justify-center mt-6">
      <TabsList className='bg-transparent'>
      <TabsTrigger value="signup" className='data-[state=active]:border-b-4 data-[state=active]:shadow-none text-black data-[state=active]:text-red-500 data-[state=active]:rounded-none rounded-none hover:border-transparent flex flex-col mr-3'>
      <SlidersHorizontal />
         All
         <div className='bg-red-500 min-w-20 min-h-1 max-h-1'></div>
        </TabsTrigger>
        <TabsTrigger value="signup" className='data-[state=active]:border-b-4 data-[state=active]:shadow-none text-black data-[state=active]:text-red-500 data-[state=active]:rounded-none rounded-none hover:border-transparent flex flex-col ml-3'>
        <History />
        History
        <div className='bg-red-500 min-w-20 min-h-1 max-h-1'></div>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login">{content1}</TabsContent>
      <TabsContent value="signup">{content2}</TabsContent>
    </Tabs>
  )
};

export default FilterTabs
