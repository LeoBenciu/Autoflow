import Header from '@/components/header'
import Footer from '@/components/footer'
import React, { useEffect } from 'react'
import CarHeader from '@/components/CarHeader'
import CarPicturesCarousel from '@/components/CarPicturesCarousel'
import CarDetailedSection from '@/components/CarDetailedSection'
import { useParams } from 'react-router'
import { useGetCarPostQuery } from '@/redux/slices/apiSlice'

const CarPage = () => {

  const {id} = useParams();
  const {data} = useGetCarPostQuery(id);

  return (
      <div className='relative container min-w-screen-2xl max-w-screen-2xl min-h-max bg-[var(--background)] mx-auto pl-24 pr-24 flex flex-col mt-10'>
        <CarHeader data={data}/>
        <CarPicturesCarousel data={data}/>
        <CarDetailedSection data={data}/>
      </div>
  )
}

export default CarPage;
