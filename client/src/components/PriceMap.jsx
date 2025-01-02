import React from 'react'

const PriceMap = () => {
  return (
    <div className='flex flex-col gap-9 items-start mt-24'>
    <h1 className='font-extrabold text-3xl text'>Price map</h1>
    <div className='bg-white min-w-full min-h-max max-h-max rounded-lg flex flex-col p-10'>
        <p className='text-sm'>Compared with more than <span className='font-extrabold'>677 similar vehicles</span> offered in recent months.</p>
        <p className='text-sm'>We take in account vehicle characteristics.</p>
        <div className='bg-green-600 min-w-max max-w-max py-3 px-7 mx-auto rounded-lg mt-5'>
            <p className='text-sm text-white'>THIS CAR</p>
            <h4 className='font-bold text-white text-lg'>€10,234</h4>
        </div>
        <div className='flex flex-row justify-around gap-1 mt-5'>
            <div className='flex-1 flex flex-col gap-3 min-h-[50px]'>
                <p className='text-sm font-bold text-center'>Top offer</p> 
                <div className='min-h-2 max-h-2 bg-green-600 rounded-[3px] flex-1'></div>
            </div>
            <div className='flex-1 flex flex-col gap-3 min-h-[50px]'>
                <p className='text-sm font-bold text-center'>Very good price</p> 
                <div className='min-h-2 max-h-2 bg-gradient-to-r from-green-600 to-green-400 rounded-[3px] flex-1'></div>
            </div>
            <div className='flex-1 flex flex-col gap-3 min-h-[50px]'>
                <p className='text-sm font-bold text-center'>Fair price</p> 
                <div className='min-h-2 max-h-2 bg-gradient-to-r from-green-400 to-yellow-400 rounded-[3px] flex-1'></div>
            </div>
            <div className='flex-1 flex flex-col gap-3 min-h-[50px]'>
                <p className='text-sm font-bold text-center'>Higher price</p> 
                <div className='min-h-2 max-h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-[3px] flex-1'></div>
            </div>
            <div className='flex-1 flex flex-col gap-3 min-h-[50px]'>
                <p className='text-sm font-bold text-center'>High price</p> 
                <div className='min-h-2 max-h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-[3px] flex-1'></div>
            </div>
        </div>

        <div className='flex flex-row min-w-full mt-1 justify-around px-10'>
            <p className='text-sm'>€12,302</p>
            <p className='text-sm'>€13,120</p>
            <p className='text-sm'>€14,046</p>
            <p className='text-sm'>€14,868</p>
        </div>
    </div>
    </div>
  )
}

export default PriceMap;
