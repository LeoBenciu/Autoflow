import React from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Outlet } from 'react-router'

const PrincipalPage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
    <Header/>
    <div className='flex-grow'>
      <Outlet/>
    </div>
    <Footer margintop={false} positionAbsolute={false} bottom0={false}/>
  </div>
  )
}

export default PrincipalPage
