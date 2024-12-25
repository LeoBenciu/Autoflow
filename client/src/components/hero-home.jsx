import React from 'react';
import { Button } from './ui/button';
import bmw from '../assets/bmw.png'
import HeroTabs from '@/schadcn/HeroTabs';
import { HeroSelector } from '@/schadcn/HeroSelector';
import { Input } from "@/components/ui/input"
import { HeroCarousel } from '@/schadcn/HeroCarousel';


const HeroSection = () => {
  return (
    <div className=' h-max flex flex-row'>

      <div className='flex flex-col min-h-full flex-1 px-3 pt-28 mx-auto'>
        <h1 className='text-5xl font-extrabold'>Your trusted partner in finding the <span className='text-red-500'>perfect vehicle</span></h1>
        <p className='mt-10'>Drive Your Dreams</p>
        <div className='bg-white min-w-[30rem] max-w-[30rem] min-h-max rounded-xl mt-20 mx-auto p-3'>
            <HeroTabs></HeroTabs>
            <Input className="mt-7 placeholder:text-black" placeholder="Location"/>
            <div className='flex flex-row mt-7 gap-3'>
                <HeroSelector placeholder="Make"/>
                <HeroSelector placeholder="Model"/>  
            </div>
            <div className='flex flex-row mt-7 gap-3'>
                <HeroSelector placeholder="Min price"/>
                <HeroSelector placeholder="Max price"/>                  
            </div>
            <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-black hover:to-black font-bold text-white min-w-full hover:border-transparent mt-7">Search Results</Button>
        </div>
      </div>

      <div className='flex flex-col  min-h-full flex-1 px-3'>
        <img src={bmw} className='w-full h-full object-contain'/>
        <HeroCarousel/>
      </div>

    </div>
  )
}

export default HeroSection;
