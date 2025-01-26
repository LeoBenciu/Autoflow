import React from 'react'
import { Settings2, ChartNoAxesGantt, Calendar, Car, Fuel, LifeBuoy, Gauge, PaintBucket, Droplet, Cylinder } from 'lucide-react';

const Details = ({data}) => {
  return (
    <div className='flex flex-col items-start'>
      <h1 className='font-extrabold text-3xl'>Details</h1>
      <div className='flex flex-col min-w-full bg-white p-10 mt-9 rounded-lg'>
      <div className='flex flex-row justify-between min-w-full '>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <ChartNoAxesGantt className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>MILEAGE</p>
            <p className='text-lg font-semibold '>{data?.mileage} km</p>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <Calendar className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>FIRST REGISTRATION</p>
            <p className='text-lg font-semibold '>{data?.year}</p>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <Car className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>POWER</p>
            <p className='text-lg font-semibold '>{data?.engine_power} hp</p>
          </div>
        </div>

      </div>
      <div className='flex flex-row mt-9 justify-between min-w-full '>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <Settings2 className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>TRANSMISSION</p>
            <p className='text-lg font-semibold '>{data?.transmission}</p>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <Fuel className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>FUEL</p>
            <p className='text-lg font-semibold '>{data?.fuel}</p>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <LifeBuoy className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>TRACTION</p>
            <p className='text-lg font-semibold '>{data?.traction}</p>
          </div>
        </div>

      </div>

      <div className='flex flex-row mt-9 justify-between min-w-full '>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <Cylinder className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>ENGINE SIZE</p>
            <p className='text-lg font-semibold '>{data?.engine_size}cc</p>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <PaintBucket className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>EXTERIOR COLOR</p>
            <p className='text-lg font-semibold '>{data?.color[0].toUpperCase()+data?.color.slice(1)}</p>
          </div>
        </div>

        <div className='flex flex-row items-center gap-1 min-w-[175px] max-w-[175px]'>
          <Droplet className='size-10'/>
          <div className='text-left'>
            <p className='text-xs font-bold text-red-600'>INTERIOR COLOR</p>
            <p className='text-lg font-semibold '>{data?.interior_color[0].toUpperCase()+data?.interior_color.slice(1)}</p>
          </div>
        </div>

      </div>
      </div>
    </div>
  )
}

export default Details;
