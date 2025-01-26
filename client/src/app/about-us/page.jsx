import React, { useEffect } from 'react'
import HeroAboutUs from '@/components/HeroAboutUs'
import VideoAboutUs from '@/components/VideoAboutUs'
import FeatureSectionAboutUs from '@/components/FeatureSectionAboutUs'
import CarAudit from '../../assets/CarAuditAboutUs.png'
import CarFinancing from '../../assets/CarFinancingAboutUs.png'
import FastSelling from '../../assets/FastCarSellingAboutUs.png'
import CarDelivery from '../../assets/CarDeliveryAboutUs.png'
import final from '../../assets/finalAboutUs.png'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion';

const AboutUsPage = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    
    const timer = setTimeout(() => {
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
          });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const features =[
    {
      number: '01.',
      title: 'Instant Cash Offers for Your Car',
      description: 'Skip the wait and get an immediate offer for your car. While you can list your vehicle on our marketplace for maximum value, our instant purchase option provides a quick and hassle-free alternative when you need to sell fast.',
      picture: FastSelling,
      left: false,
      id: 'fast-selling'
    },
    {
      number: '02.',
      title: 'Flexible Car Financing Solutions',
      description: 'Access competitive financing options tailored to your needs. We partner with trusted lenders to provide you with favorable rates and flexible payment plans, making your dream car more affordable.',
      picture: CarFinancing,
      left: true,
      id:'car-financing'
    },
    {
      number: '03.',
      title: 'Secure Car Delivery Service',
      description: 'Get your car delivered right to your doorstep with our professional transport service. We ensure safe and timely delivery anywhere in the country, tracked in real-time for your peace of mind.',
      picture: CarDelivery,
      left: false,
      id:'car-delivery'
    },
    {
      number: '04.',
      title: 'Professional Car Audit: Your Guarantee of Quality',
      description: 'Every vehicle undergoes a thorough 150-point inspection by certified experts. We verify documentation, check accident history, and assess mechanical integrity to ensure complete transparency about the car\'s condition. Our detailed reports help you make confident buying decisions.',
      picture: CarAudit,
      left: true,
      id:'car-audit'
    }
  ];

  return (
    <div className=' container min-w-screen-2xl max-w-screen-2xl min-h-max bg-[var(--background)] mx-auto pl-24 pr-24'>
    <HeroAboutUs></HeroAboutUs>
    <VideoAboutUs></VideoAboutUs>
    {features.map((feature)=>(
      <FeatureSectionAboutUs
      number={feature.number}
      title={feature.title}
      description={feature.description}
      picture={feature.picture}
      left={feature.left}
      id={feature.id}
      ></FeatureSectionAboutUs>
    ))}
    <div className='min-w-full max-w-full min-h-72 max-h-72 bg-red-400 rounded-2xl mt-32 bg-no-repeat'
    style={{ backgroundImage: `url(${final})` }}>
      <div className='bg-gradient-to-r from-red-500/70 via-red-500/90 to-red-500 min-w-full max-w-full min-h-72 max-h-72 rounded-2xl
      flex flex-col justify-center items-center gap-6'>
      <h3 className='text-white text-3xl font-extrabold'>Try out how Autoflow works.</h3>
      <p className='text-white font-semibold text-base'>We make buying used cars a pleasure for our users.</p>
      <motion.button className='bg-black rounded-md border-none text-white font-bold text-base px-8 py-3'
      onClick={()=>navigate('/cars')}
      whileHover={{scale:1.1}}
      whileTap={{scale:0.9}}>Show vehicles</motion.button>
      </div>
    </div>
    </div>
  )
}

export default AboutUsPage
