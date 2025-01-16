import { Button } from '@/components/ui/button'
import React from 'react'
import { Outlet } from 'react-router'

const SMPFPage = () => {
  return (
      <div className=' container min-w-screen-2xl max-w-screen-2xl  bg-[var(--background)] mx-auto flex flex-col  justify-start items-start min-h-max mt-10'>
      <div className=' min-w-full max-w-full min-h-[5rem] max-h-[5rem] flex flex-row gap-5 items-center focus:border-none focus:outline-none focus:'>
        <Button className='shadow-none font-bold text-base hover:border-transparent text-black'>My posts</Button>
        <Button className='shadow-none font-bold text-base hover:border-transparent text-black'>Conversations</Button>
        <Button className='shadow-none font-bold text-base hover:border-transparent text-black'>Settings</Button>
      </div>
      <div className=' min-h-max max-h-max min-w-full max-w-full'>
      <Outlet></Outlet>
      </div>
      </div>
  )
}

export default SMPFPage
