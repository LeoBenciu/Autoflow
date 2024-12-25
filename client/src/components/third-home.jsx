import React from 'react'
import picture from '../assets/comparison.svg'

const ThirdHome = () => {
  return (
    <div className='h-max flex flex-row mt-52 bg-red-500 rounded-xl'>
      <div className='flex flex-col flex-1 mx-52 mt-12'>
        <h2 className='font-extrabold text-4xl text-white'>Trade-in & Drive Away</h2>
        <p className='mt-8 text-white'>Get an instant offer for your current car and drive home in your new one. Our team handles everything - from evaluation to paperwork - so you can upgrade your ride in one simple visit.</p>
      </div>
      <div className='flex-1 mr-52 '>
        <img src={picture} className='size-96'></img>
      </div>
    </div>
  )
}

export default ThirdHome;
