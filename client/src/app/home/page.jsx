import Header from '@/components/header'
import Footer from '@/components/footer'
import React from 'react'
import HeroSection from '@/components/hero-home'
import SecondHome from '@/components/second-home'
import ThirdHome from '@/components/third-home'

const HomePage = () => {
  return (
    <div className='h-screen flex flex-col content-center overflow-scroll'>
      <Header/>
      <div className=' container min-w-screen-2xl max-w-screen-2xl min-h-max bg-[var(--background)] mx-auto pl-24 pr-24'>
      <HeroSection></HeroSection>
      <SecondHome></SecondHome>
      <ThirdHome></ThirdHome>
      </div>
      <Footer/>
    </div>
  )
}

export default HomePage
