import React from 'react'


const FeatureSectionAboutUs = ({number, title, description, picture, left,id}) => {
  return (
    <div className={`min-w-full max-w-full min-h-max max-h-max flex ${left? 'flex-row-reverse': 'flex-row'} gap-x-16 relative mt-32`} id={id}>
      <div className='flex-1 flex flex-col items-start justify-center gap-6 z-20'>
        <h1 className='text-red-500 font-bold text-2xl'>{number}</h1>
        <h3 className='text-4xl font-bold text-left'>{title}</h3>
        <p className='text-left'>{description}</p>
      </div>
      <div className='flex-1'>
        <img src={picture} className='rounded-xl'></img>
      </div>
    </div>
  )
}

export default FeatureSectionAboutUs
