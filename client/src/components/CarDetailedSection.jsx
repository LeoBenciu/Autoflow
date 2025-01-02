import React from 'react'
import PriceMap from './PriceMap';
import Notes from './Notes';
import Details from './Details';
import Financing from './Financing';
import { Calculator, Truck, ShoppingCart, Star, CircleChevronUp, FileCheck2, MessageCircle } from 'lucide-react';

const CarDetailedSection = () => {
  return (
    <div className='flex flex-row mt-8 min-h-max'>
      <div className='flex flex-col flex-1 h-[100rem] px-9 min-h-max'>
        <Details></Details>
        <Notes></Notes>
        <PriceMap></PriceMap>
        <Financing></Financing>
      </div>
      <div className='w-96 h-max sticky top-24'>
        <div className='bg-white h-max rounded-lg flex flex-col'>
          <div className='bg-green-100 min-w-full h-8 rounded-t-lg flex flex-row items-center text-green-600 font-bold justify-center'>
            <p>Top offer</p>
          </div>
          <div className='p-7'>
          <div className='flex flex-row justify-between'>
            <h3 className='font-bold text-2xl'>Car price</h3>
            <h3 className='font-bold text-2xl'>10,234€</h3>
          </div>
          <div className='bg-gradient-to-r from-red-500 to-red-700 flex flex-row gap-3 justify-center items-center py-4 rounded-sm text-white mt-4 font-bold cursor-pointer hover:shadow-lg'><MessageCircle size={25} /> Message seller</div>
          <a className='border-[1px] border-red-500 flex flex-row gap-3 justify-center items-center py-4 rounded-sm text-red-500 mt-4 font-bold cursor-pointer hover:bg-red-100 hover:text-red-500' href='#Financing'><Calculator size={25} /> Financing</a>
          <div className='flex flex-row min-w-full gap-2'> 
          <div className='border-[1px] border-red-500 flex flex-row gap-3 justify-center items-center py-4 rounded-sm text-red-500 mt-4 font-bold cursor-pointer hover:bg-red-100 hover:text-red-500 flex-1'><FileCheck2 size={25} />Car audit</div>
          <div className='border-[1px] border-red-500 flex flex-row gap-3 justify-center items-center py-4 rounded-sm text-red-500 mt-4 font-bold cursor-pointer hover:bg-red-100 hover:text-red-500 flex-1'><Truck size={25} />Car delivery</div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetailedSection;
