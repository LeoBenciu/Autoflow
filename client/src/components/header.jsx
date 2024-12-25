import MyNavMenu from '@/schadcn/MyNavMenu';
import React from 'react';
import logoIcon from '../assets/AutoFlow.svg'
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from 'react-router';


const Header = () => {
    const navigate = useNavigate();

  return (
    <div className='bg-[var(--primary)] w-full min-h-20'>
    <div className='container mx-auto h-full flex flex-row justify-between px-1 min-w-screen-2xl items-center'>
      <div className='flex flex-row gap-3 cursor-pointer' onClick={()=>navigate('/home')}>
        <img src={logoIcon} className='size-8'></img>
        <h1 className='text-2xl font-extrabold text-[var(--secondary)]'>AutoFlow</h1>
      </div>
      <div className=''><MyNavMenu/></div>
      <div className='flex flex-row content-center items-center gap-8'>
        <div className='relative group'>
          <Heart size={24} strokeWidth={1.90} className='cursor-pointer relative'/>
          <div className='absolute -top-2 -right-2 size-4 bg-red-500 group-hover:bg-red-400 rounded-full text-xs text-white'>1</div>
        </div>
        <Button onClick={()=> navigate('/users/login')} className='text-white bg-red-500 hover:bg-red-400 hover:border-red-400 rounded-xl flex flex-row items-center text-center content-center'>Login</Button>
        <Avatar className='cursor-pointer'>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  </div>
  )
}

export default Header;
