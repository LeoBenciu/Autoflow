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
        <div className='bg-white min-w-[30rem] max-w-[30rem] min-h-max rounded-xl mt-10 mx-auto p-6'>
            <HeroTabs></HeroTabs>
            <h3 className='text-xl font-bold text-left ml-2 mt-6'>Location details</h3>
            <div className='flex flex-row mt-3 gap-3'>
                <HeroSelector placeholder="Country"/>
                <HeroSelector placeholder="State"/>  
            </div>
            <h3 className='text-xl font-bold text-left mt-6 ml-2'>Car details</h3>
            <div className='flex flex-row mt-3 gap-3'>
                <HeroSelector placeholder="Make"/>
                <HeroSelector placeholder="Model"/>  
            </div>
            <div className='flex flex-row mt-7 gap-3'>
                <HeroSelector placeholder="Min price"/>
                <HeroSelector placeholder="Max price"/>                  
            </div>
            <Button className="bg-gradient-to-r min-h-12 max-h-12
             from-red-500 to-red-600 hover:from-black hover:to-black font-bold text-white min-w-full hover:border-transparent mt-7">Search Results</Button>
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
