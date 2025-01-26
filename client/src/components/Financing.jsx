import React from 'react'
import { Slider } from "@/components/ui/slider"
import { useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import car from '../assets/carmodel.jpg'
import { Headset } from 'lucide-react';
  

const Financing = ({data}) => {
    const [monthsValue, setMonthsValue] = useState(0);
    const [payback, setPayback] = useState(0);

  return (
    <div className='flex flex-col gap-9 items-start mt-24' id='Financing'>
    <h1 className='font-extrabold text-3xl'>Financing</h1>
    <div className='bg-white min-w-full min-h-96 rounded-lg p-8'>
      <div className='flex flex-row min-w-full max-h-max justify-between'>
        <p className='text-sm'>Payback period</p>
        <p className='text-sm font-bold'>{monthsValue === 0? 6: monthsValue===10 ? 12: monthsValue===20 ? 24: monthsValue===30 ? 36: monthsValue===40 ? 48: monthsValue===50 ? 60: 0} months</p>
      </div>
      <Slider 
        defaultValue={[0]} 
        max={50} 
        step={10} 
        className='mt-10'
        onValueChange={(value) => setMonthsValue(value[0])} 
      />
      <div className='mt-3 flex flex-row min-w-full justify-between pl-2'>
        <p className={`text-sm ${monthsValue === 0 ? 'text-red-500 font-bold' : ''}`}>6</p>
        <p className={`text-sm ${monthsValue === 10 ? 'text-red-500 font-bold' : ''}`}>12</p>
        <p className={`text-sm ${monthsValue === 20 ? 'text-red-500 font-bold' : ''}`}>24</p>
        <p className={`text-sm ${monthsValue === 30 ? 'text-red-500 font-bold' : ''}`}>36</p>
        <p className={`text-sm ${monthsValue === 40 ? 'text-red-500 font-bold' : ''}`}>48</p>
        <p className={`text-sm ${monthsValue === 50 ? 'text-red-500 font-bold' : ''}`}>60</p>
      </div>
      <div className='flex flex-row min-w-full max-h-max justify-between mt-10'>
        <p className='text-sm flex flex-row items-center gap-2'>Down payment(%)
            <span>
                <TooltipProvider>
                     <Tooltip>
                    <TooltipTrigger className='rounded-full w-[15px] h-[15px] bg-gray-200 hover:border-transparent flex flex-row items-center content-center justify-center'>i</TooltipTrigger>
                    <TooltipContent className='bg-gray-200 text-black'>
                      <p>How much you'll pay in advance</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
            </span></p>
        <p className='text-sm font-bold'>{payback + 20}% = {(payback+20)*data?.price /100}</p>
      </div>
      <Slider 
        defaultValue={[0]} 
        max={60} 
        step={10} 
        className='mt-10'
        onValueChange={(value) => setPayback(value[0])} 
      />
      <div className='mt-3 flex flex-row min-w-full justify-between '>
        <p className={`text-sm ${payback === 0 ? 'text-red-500 font-bold' : ''}`}>20</p>
        <p className={`text-sm ${payback === 10 ? 'text-red-500 font-bold' : ''}`}>30</p>
        <p className={`text-sm ${payback === 20 ? 'text-red-500 font-bold' : ''}`}>40</p>
        <p className={`text-sm ${payback === 30 ? 'text-red-500 font-bold' : ''}`}>50</p>
        <p className={`text-sm ${payback === 40 ? 'text-red-500 font-bold' : ''}`}>60</p>
        <p className={`text-sm ${payback === 50 ? 'text-red-500 font-bold' : ''}`}>70</p>
        <p className={`text-sm ${payback === 50 ? 'text-red-500 font-bold' : ''}`}>80</p>
      </div>
      <div className='w-full h-max border-2 border-gray-200 flex flex-row rounded-lg mt-10 items-center justify-between pr-5'>
        <img src={data?.image_urls[0]} className='w-[7rem] h-24 object-cover rounded-s-lg'></img>
        <div className='flex flex-col text-left gap-5'>
            <p className='text-xs'>DOWNPAYMENT({payback + 20}%)</p>
            <p className='text-lg font-bold'>{(payback+20)*data?.price /100}</p>
        </div>
        <div className='flex flex-col text-left gap-5'>
            <p className='text-xs'>INSTALLMENT</p>
            <p className='text-lg font-bold'>{monthsValue === 0? 6: monthsValue===10 ? 12: monthsValue===20 ? 24: monthsValue===30 ? 36: monthsValue===40 ? 48: monthsValue===50 ? 60: 0}</p>
        </div>
        <div className='flex flex-col text-left gap-5'>
            <p className='text-xs'>INTEREST RATE</p>
            <p className='text-lg font-bold'>10.25 %</p>
        </div>
        <div className='flex flex-col text-left gap-5'>
            <p className='text-xs text-red-500'>MONTHLY</p>
            <p className='text-lg font-bold text-red-500'>{Math.trunc((parseFloat(data?.price) +(parseFloat(data?.price)*10.25/100) - (payback+20)*data?.price /100) 
            /(monthsValue === 0? 6: monthsValue===10 ? 12: monthsValue===20 ? 24: monthsValue===30 ? 36: monthsValue===40 ? 48: monthsValue===50 ? 60: 0))}</p>
        </div>
      </div>

      <div className='flex flex-row h-max mt-10 justify-between'>
        <p>Need some advice?</p>
        <div className='flex flex-row gap-2'>
            <div className='flex flex-col justify-center items-center bg-red-200 rounded-full size-10'>
                <Headset size={20} className='text-red-500'/>
            </div>
            <div className='flex flex-col gap-1'>
            <p className='text-xs'>Mo–Su 8 am-8 pm</p>
            <p className='font-bold text-sm'>+70 31 223423</p>
            </div>
        </div>
      </div>

      
    </div>
  </div>
  )
}

export default Financing;
