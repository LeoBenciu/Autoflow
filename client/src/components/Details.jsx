import React from 'react'
import { Settings2, ChartNoAxesGantt, Calendar, Car, Fuel, LifeBuoy, Gauge, PaintBucket, Droplet, Cylinder } from 'lucide-react';

const Details = () => {
  return (
    <div className='flex flex-col items-start'>
      <h1 className='font-extrabold text-3xl'>Details</h1>
      <div className='flex flex-col min-w-full bg-white p-10 mt-9 rounded-lg'>
      <div className='flex flex-row justify-between min-w-full '>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <ChartNoAxesGantt className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>MILEAGE</p>
            <p className='text-lg font-semibold '>192922 km</p>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <Calendar className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>FIRST REGISTRATION</p>
            <p className='text-lg font-semibold '>2020</p>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <Car className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>POWER</p>
            <p className='text-lg font-semibold '>210 hp</p>
          </div>
        </div>

      </div>
      <div className='flex flex-row mt-9 justify-between min-w-full '>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <Settings2 className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>TRANSMISSION</p>
            <p className='text-lg font-semibold '>Automatic</p>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <Fuel className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>FUEL</p>
            <p className='text-lg font-semibold '>Petrol</p>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <LifeBuoy className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>TRACTION</p>
            <p className='text-lg font-semibold '>4WD</p>
          </div>
        </div>

      </div>

      <div className='flex flex-row mt-9 justify-between min-w-full '>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <Cylinder className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>ENGINE SIZE</p>
            <p className='text-lg font-semibold '>3000cc</p>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <PaintBucket className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>COLOR</p>
            <p className='text-lg font-semibold '>Blue</p>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <Droplet className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>INTERIOR COLOR</p>
            <p className='text-lg font-semibold '>White</p>
          </div>
        </div>

      </div>
      </div>
    </div>
  )
}

export default Details;
