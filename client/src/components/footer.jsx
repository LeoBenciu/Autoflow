import MyNavFooter from '@/schadcn/MyNavFooter';
import React from 'react';
import logoIcon from '../assets/AutoFlow.svg';
import { useNavigate } from 'react-router';


const Footer = () => {
    const navigate = useNavigate();

  return (
    <div className='bg-[var(--primary)] w-full min-h-20 mt-32'>
    <div className='container mx-auto h-full flex flex-row justify-between px-1 min-w-screen-2xl items-center'>
      <div className='flex flex-row gap-3 cursor-pointer' onClick={()=>navigate('/home')}>
        <img src={logoIcon} className='size-8'></img>
        <h1 className='text-2xl font-extrabold text-[var(--secondary)]'>AutoFlow</h1>
      </div>
      <div className=''><MyNavFooter/></div>
    </div>
  </div>
  )
}

export default Footer;
