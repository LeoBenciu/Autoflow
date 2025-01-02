import { ChevronLeft, Heart, Share, ChartNoAxesGantt, Calendar, Car, Settings2, Fuel, LifeBuoy } from 'lucide-react';
import React from 'react'

const CarHeader = () => {
  return (
<div className='flex flex-col'>
<div className='flex flex-row justify-between items-center w-full px-4'>
    <div className='flex flex-row items-center gap-4'>
        <ChevronLeft size={24} className='hover:text-red-500 cursor-pointer'/>
        <h2 className='text-3xl font-bold'>Title of the post with some default details</h2>
    </div>
    <div className='flex items-center gap-5 cursor-pointer'>
        <div className='flex items-center gap-1'>
        <Heart size={20} className='text-red-500'/>
        <p className='text-red-500 underline underline-offset-4 hover:no-underline'>Favorites</p>
        </div>
        <div className='flex items-center gap-1'>
        <Share size={20} className='text-red-500'/>
        <p className='text-red-500 underline underline-offset-4 hover:no-underline'>Share</p>
        </div>
    </div>
</div>

<div className='flex flex-row px-14 mt-4 gap-4'>
    <div className='flex flex-row items-center gap-1'>
        <ChartNoAxesGantt className='size-6'/>
        <p className='text-sm font-semibold '>192922 km</p>
    </div>

    <div className='flex flex-row items-center gap-1'>
        <Calendar className='size-6'/>
        <p className='text-sm font-semibold '>2020</p>
    </div>

    <div className='flex flex-row items-center gap-1'>
        <Car className='size-6'/>
        <p className='text-sm font-semibold '>210 hp</p>
    </div>

    <div className='flex flex-row items-center gap-1'>
        <Settings2 className='size-5'/>
        <p className='text-sm font-semibold '>Automatic</p>
    </div>

    <div className='flex flex-row items-center gap-1'>
        <Fuel className='size-5'/>
        <p className='text-sm font-semibold '>Petrol</p>
    </div>

    <div className='flex flex-row items-center gap-1'>
        <LifeBuoy className='size-5'/>
        <p className='text-sm font-semibold '>4WD</p>
    </div>

</div>
</div>
  )
}

export default CarHeader;
