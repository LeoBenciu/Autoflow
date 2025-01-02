import MyNavMenu from '@/schadcn/MyNavMenu';
import React from 'react';
import logoIcon from '../assets/AutoFlow.svg'
import { Heart, MessageCircle, Settings, Car,LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"



const Header = () => {
    const navigate = useNavigate();

  return (
    <div className='bg-[var(--primary)] w-full min-h-20 sticky top-0 z-40 flex items-center'>
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
        <DropdownMenu>
          <DropdownMenuTrigger className='hover:border-transparent focus:border-transparent focus:outline-none outline-none'>
            <Avatar className='cursor-pointer'>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className='text-xl flex flex-row items-center gap-5'>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p>Username</p>
              <p className='font-light text-sm'>example@example.com</p>
            </div> 
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className='hover:border-transparent'>
                  <button className='text-sm font-normal hover:text-red-500 hover:border-transparent flex flex-row items-center'>
                    <LogOut size={23} className='hover:border-transparent border-transparent'/>
                  </button>
                </TooltipTrigger>
                <TooltipContent className='bg-gray-700 text-white' side="left">
                  <p className='text-sm font-bold'>Log out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='text-base cursor-pointer hover:bg-gray-200 data-[highlighted]:bg-gray-200 group' onClick={()=>{navigate('/cars/favorites')}}><Heart size={30} className='group-hover:text-red-500'/>Favorites cars</DropdownMenuItem>
            <DropdownMenuItem className='text-base cursor-pointer hover:bg-gray-200 data-[highlighted]:bg-gray-200 group' onClick={()=>{navigate('/conversations')}}><MessageCircle size={30} className='group-hover:text-red-500'/>Conversations</DropdownMenuItem>
            <DropdownMenuItem className='text-base cursor-pointer hover:bg-gray-200 data-[highlighted]:bg-gray-200 group' onClick={()=>{navigate('/posts')}}><Car size={40} className='group-hover:text-red-500'/>My posts</DropdownMenuItem>
            <DropdownMenuItem className='text-base cursor-pointer hover:bg-gray-200 data-[highlighted]:bg-gray-200 group' onClick={()=>{navigate('/settings')}}><Settings size={40} className='group-hover:text-red-500'/>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
  )
}

export default Header;
