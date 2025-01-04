import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const MyTabs = ({content1, content2}) => {
  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className='bg-slate-100'>
        <TabsTrigger value="login" className='data-[state=active]:bg-white outline-none focus:outline-none'>Login</TabsTrigger>
        <TabsTrigger value="signup" className='data-[state=active]:bg-white outline-none focus:outline-none'>Signup</TabsTrigger>
      </TabsList>
      <TabsContent value="login">{content1}</TabsContent>
      <TabsContent value="signup">{content2}</TabsContent>
    </Tabs>
  )
}

export default MyTabs
