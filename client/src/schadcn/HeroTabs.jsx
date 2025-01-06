import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate } from 'react-router';


const HeroTabs = ({content1, content2}) => {

  const navigate = useNavigate();

  return (
    <Tabs defaultValue="login" className="w-[400px] mx-auto">
      <TabsList className='bg-slate-100'>
        <TabsTrigger value="login" className='data-[state=active]:bg-red-200 data-[state=active]:text-red-500  w-40 hover:border-transparent font-normal text-xl text-black'>Buy</TabsTrigger>
        <TabsTrigger value="signup" className='data-[state=active]:bg-red-200 data-[state=active]:text-red-500 w-40 hover:border-transparent font-normal text-xl text-black'
        onClick={(()=>navigate('/posts'))}>Sell</TabsTrigger>
      </TabsList>
      <TabsContent value="login">{content1}</TabsContent>
      <TabsContent value="signup">{content2}</TabsContent>
    </Tabs>
  )
};

export default HeroTabs
