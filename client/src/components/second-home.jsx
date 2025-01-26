import React from 'react'
import { Button } from './ui/button'
import presentation from '../assets/ AutoflowVideo.mp4'
import carRepair from '../assets/car_repair.svg'
import onlinePayments from '../assets/online_payments.svg'
import carDelivery from '../assets/delivery.svg'
import { useNavigate } from 'react-router'
import {motion} from "framer-motion";

const SecondHome = () => {
  const navigate = useNavigate();
  return (
    <div className='h-max flex flex-col mt-52'>
      <h1 className='font-extrabold text-4xl'>How does it work?</h1>

      <div className='flex flex-row mt-10'>

        <div className='flex flex-col flex-1 mx-10 text-left'>
            <img className='size-52 mx-auto' src={carRepair}></img>
            <h3 className='text-red-600 font-extrabold'>01.</h3>
            <h1 className='font-bold text-2xl'>Car Audit</h1>
            <p className='text-sm mt-5'>Our certified inspectors perform thorough 150-point checks and deliver same-day digital reports with photos. Get an unbiased assessment and avoid costly surprises</p>
        </div>
        <div className='flex flex-col flex-1 mx-10 text-left'>
            <img className='size-52 mx-auto' src={carDelivery}></img>
            <h3 className='text-red-600 font-extrabold'>02.</h3>
            <h1 className='font-bold text-2xl'>Delivery</h1>
            <p className='text-sm mt-5'>Enjoy secure, insured shipping and real-time tracking. Get your car delivered without leaving your home.</p>
        </div>
        <div className='flex flex-col flex-1 mx-10 text-left'>
            <img className='size-52 mx-auto' src={onlinePayments}></img>
            <h3 className='text-red-600 font-extrabold'>03.</h3>
            <h1 className='font-bold text-2xl'>Financing</h1>
            <p className='text-sm mt-5'>Get competitive rates and flexible payment terms for your dream car. Submit your application online and receive an approval decision within minutes.</p>
        </div>
        

      </div>

      <motion.button className="bg-gradient-to-r from-red-500 to-red-700 min-w-40  mx-auto mt-10 py-2 px-4 font-bold text-white"
      onClick={()=>{navigate('/about-us');
        window.scrollTo({top: 0, behavior: 'smooth'})
      }}
      whileHover={{scale:1.1}}
      whileTap={{scale:0.9}}>Want to know more?</motion.button>

      <video width="750" height="500" controls className='rounded-xl mx-auto mt-16'>
      <source src={presentation} type="video/mp4"/>
      </video>
    </div>
  )
}

export default SecondHome
