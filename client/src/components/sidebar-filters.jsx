import FilterTabs from '@/schadcn/FilterTabs'
import React from 'react'
import { Button } from './ui/button'
import { CirclePlus } from 'lucide-react'
import { HeroSelector } from '@/schadcn/HeroSelector'
import ColorsTooltip from '@/schadcn/ColorsTooltip'



const SidebarFilters = () => {
  return (
    <div className='flex flex-col min-h-max max-h-max bg-white min-w-[25%] max-w-[25%] px-3 py-5 rounded-xl'>
        <h3 className='text-left font-bold text-xl'>Filter</h3>
        <FilterTabs/>
        <h4 className='mt-6 text-left font-bold'>MAKE AND MODEL</h4>
        <Button className="text-black border-gray-300 shadow-none mt-2 shadow-sm"><CirclePlus/>Add a car</Button>
        <h4 className='mt-4 text-left font-bold'>PRICE(€)</h4>
        <div className='flex flex-row gap-2 mt-2'>
          <HeroSelector placeholder='From'/>
          <HeroSelector placeholder='To'/>
        </div>
        <h4 className='mt-4 text-left font-bold'>REGISTRATION</h4>
        <div className='flex flex-row gap-2 mt-2'>
          <HeroSelector placeholder='From'/>
          <HeroSelector placeholder='To'/>
        </div>
        <h4 className='mt-4 text-left font-bold'>MILEAGE</h4>
        <div className='flex flex-row gap-2 mt-2'>
          <HeroSelector placeholder='From'/>
          <HeroSelector placeholder='To'/>
        </div>
        <h4 className='mt-4 text-left font-bold'>TRANSMISSION</h4>
        <div className='flex flex-row gap-2 mt-2'>
          <Button className="min-w-[49%] text-black border-gray-200 shadow-sm">Automatic</Button>
          <Button className="min-w-[49%] text-black border-gray-200 shadow-sm">Manual</Button>
        </div>
        <h4 className='mt-4 text-left font-bold'>FUEL</h4>
        <div className='flex flex-row mt-2'>
          <HeroSelector className="min-w-full" placeholder='All'/>
        </div>
        <h4 className='mt-4 text-left font-bold'>ENGINE SIZE</h4>
        <div className='flex flex-row gap-2 mt-2'>
          <HeroSelector placeholder='From'/>
          <HeroSelector placeholder='To'/>
        </div>
        <h4 className='mt-4 text-left font-bold'>POWER</h4>
        <div className='flex flex-row gap-2 mt-2'>
          <HeroSelector placeholder='From'/>
          <HeroSelector placeholder='To'/>
        </div>
        <h4 className='mt-4 mb-2 text-left font-bold'>TRACTION</h4>
        <HeroSelector className="min-w-full" placeholder="All"/>
        <h4 className='mt-4 mb-2 text-left font-bold'>VEHICLE TYPE</h4>
        <HeroSelector className="min-w-full" placeholder="All"/>
        <h4 className='mt-4 text-left font-bold'>EXTERIOR COLOR</h4>
        <div className='flex flex-row justify-around mt-3'>
        <Button className="rounded-full size-7 bg-white p-0"/>
        <Button className="rounded-full size-7 bg-black p-0"/>
        <Button className="rounded-full size-7 bg-gray-400 p-0"/>
        <Button className="rounded-full size-7 bg-red-500 p-0"/>
        <Button className="rounded-full size-7 bg-blue-500 p-0"/>
        <Button className="rounded-full size-7 bg-green-500 p-0"/>
        </div>
        <div className='flex flex-row min-w-full justify-around mt-3'>
        <Button className="rounded-full size-7 bg-yellow-400 p-0"/>
        <Button className="rounded-full size-7 bg-orange-500 p-0"/>
        <Button className="rounded-full size-7 bg-purple-500 p-0"/>
        <Button className="rounded-full size-7 bg-orange-900 p-0"/>
        <Button className="rounded-full size-7  p-0 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300"/>
        <Button className="rounded-full size-7 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 p-0"/>
        </div>
        <div className='flex flex-row min-w-full justify-around mt-3'>
        <Button className="rounded-full size-7 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 p-0"/>
        </div>
        <h4 className='mt-4 text-left font-bold'>INTERIOR COLOR</h4>
        <div className='flex flex-row justify-around mt-3'>
        <Button className="rounded-full size-7 bg-white p-0"/>
        <Button className="rounded-full size-7 bg-black p-0"/>
        <Button className="rounded-full size-7 bg-gray-400 p-0"/>
        <Button className="rounded-full size-7 bg-orange-900 p-0"/>
        <Button className="rounded-full size-7 bg-blue-900 p-0"/>
        <Button className="rounded-full size-7 bg-red-600 p-0"/>
        <Button className="rounded-full size-7 bg-stone-200 p-0"/>
        <Button className="rounded-full size-7 bg-amber-600 p-0"/>
        </div>
    </div>
  )
}

export default SidebarFilters
