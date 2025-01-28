import React from 'react'

const PriceMap = ({prices, data}) => {

    const formatEuro = (amount) => {
        return new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(amount);
      };

  return (
    <div className='flex flex-col gap-9 items-start mt-24'>
    <h1 className='font-extrabold text-3xl text'>Price map</h1>
    <div className='bg-white min-w-full min-h-max max-h-max rounded-lg flex flex-col p-10'>
        <p className='text-sm'>AI-powered car valuation tool for accurate market price estimation.</p>
        <p className='text-sm'>We take in account vehicle characteristics.</p>
        <div className={`${data?.price>prices.very_good_price?
            'bg-red-500':data?.price<=prices.very_good_price && data.price>prices.good_price?
            'bg-orange-500':data?.price<=prices.good_price && data.price>prices.average_price?
            'bg-yellow-500':data?.price<=prices.average_price && data.price>prices.bad_price?
            'bg-lime-500':'bg-green-600'} min-w-max max-w-max py-3 px-7 mx-auto rounded-lg mt-5`}>
            <p className='text-sm text-white'>THIS CAR</p>
            <h4 className='font-bold text-white text-lg'>{formatEuro(data?.price)}</h4>
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
            <p className='text-sm'>{formatEuro(prices.bad_price)}</p>
            <p className='text-sm'>{formatEuro(prices.average_price)}</p>
            <p className='text-sm'>{formatEuro(prices.good_price)}</p>
            <p className='text-sm'>{formatEuro(prices.very_good_price)}</p>
        </div>
    </div>
    </div>
  )
}

export default PriceMap;
