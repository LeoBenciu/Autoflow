import React from 'react'
import heroImage from '../assets/heroabout.png'
import { MoveDown } from 'lucide-react'
import UniqueFeatures from './3USP'
import { motion } from 'framer-motion';

const HeroAboutUs = () => {
  return (
    <div className='flex flex-col'>
    <div className='min-w-full max-w-full min-h-max max-h-max flex flex-row gap-x-16 relative'>
      <div className='flex-1 flex flex-col items-start justify-center gap-6 z-20'>
        <h3 className='text-4xl font-bold text-left'>We are Autoflow. We make buying used cars a pleasure.</h3>
        <p className='text-left'>With us you can sell your old car and select your new favorite one in an instant. We help you with a detailed car inspection, financing and delivery.</p>
        <motion.a href='#more' className='bg-gradient-to-r from-red-500 to-red-600 hover:from-red-500 hover:to-red-500 hover:shadow-lg rounded-lg flex flex-row items-center justify-center gap-7
        text-white font-bold max-w-max min-w-max  p-3 hover:text-white'
        whileHover={{scale:1.1}}
        whileTap={{scale:0.9}}><MoveDown size={20}/>I want to know more </motion.a>
      </div>
      <div className='flex-1'>
        <img src={heroImage}></img>
      </div>
    </div>
    <UniqueFeatures/>
    </div>
  )
}

export default HeroAboutUs
