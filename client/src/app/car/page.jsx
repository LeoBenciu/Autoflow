import Header from '@/components/header'
import Footer from '@/components/footer'
import React from 'react'
import CarHeader from '@/components/CarHeader'
import CarPicturesCarousel from '@/components/CarPicturesCarousel'
import CarDetailedSection from '@/components/CarDetailedSection'

const CarPage = () => {
  return (
      <div className=' container min-w-screen-2xl max-w-screen-2xl min-h-max bg-[var(--background)] mx-auto pl-24 pr-24 flex flex-col mt-10'>
        <CarHeader/>
        <CarPicturesCarousel/>
        <CarDetailedSection/>
      </div>
  )
}

export default CarPage;
