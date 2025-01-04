import React from 'react'
import { Truck, ClipboardCheck, Wallet } from 'lucide-react';

const UniqueFeatures = ({position}) => {
  return (
    <div className={`bg-white min-w-[60rem] max-w-full min-h-32 max-h-32 mx-auto mt-10 flex flex-row px-5 rounded-lg `}>
            <div className='flex flex-col flex-1 gap-3 justify-center border-r-[1px] border-gray-200 px-2'>
                <div className='flex flex-row items-center gap-2'>
                    <Truck size={30} className='text-black'/>
                    <p className='font-bold text-xl'>Car Delivery</p>
                </div>
                <p className='text-left text-gray-600'>We deliver the car straight to your door so you don't have to worry.</p>
            </div>
            <div className='flex flex-col flex-1 gap-3 justify-center px-2'>
                <div className='flex flex-row items-center gap-2'>
                    <ClipboardCheck size={30} className='text-black'/>
                    <p className='font-bold text-xl'>Car Audit</p>
                </div>
                <p className='text-left text-gray-600'>Professional inspection to verify the car's condition and history.</p>
            </div>
            <div className='flex flex-col flex-1 gap-3 justify-center border-l-[1px] border-gray-200 px-2'>
                <div className='flex flex-row items-center gap-2'>
                    <Wallet size={30} className='text-black'/>
                    <p className='font-bold text-xl'>Financing</p>
                </div>
                <p className='text-left text-gray-600'>Flexible payment options with competitive rates for your car purchase.</p>
            </div>
        </div>
  )
}

export default UniqueFeatures;
