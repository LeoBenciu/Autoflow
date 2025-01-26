import MyNavMenu from '@/schadcn/MyNavMenu';
import React, { useState } from 'react';
import logoIcon from '../assets/AutoFlow.svg'
import { Heart, MessageCircle, Settings, Car, LogOut, Menu, X } from 'lucide-react';
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
import { useLogoutMutation } from '@/redux/slices/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '@/redux/slices/userSlice';
import { useGetSavedPostsQuery } from '@/redux/slices/apiSlice';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [logout, {isLoading, error}] = useLogoutMutation();
    const {userData, isAuthenticated} = useSelector(state=> state.user);
    const { data: savedPostsData,
        error: savedPostsError,
        isLoading: savedPostsIsLoading } = useGetSavedPostsQuery();

    const handleLogout = async (e) => {
      e.preventDefault();
      try {
        await logout().unwrap();
        dispatch(clearUser());
        navigate('/home');
      } catch(err) {
        console.error('Failed to logout:', err);
      }
    };

    return (
        <div className='bg-[var(--primary)] w-full min-h-20 sticky top-0 z-40 flex items-center'>
            <div className='container mx-auto h-full flex flex-row justify-between px-4 md:px-6 lg:px-8 w-full items-center'>
                <div className='flex flex-row gap-3 cursor-pointer' onClick={()=>navigate('/home')}>
                    <img src={logoIcon} className='size-8'></img>
                    <h1 className='text-2xl font-extrabold text-[var(--secondary)] hidden md:block'>AutoFlow</h1>
                </div>

                <div className='hidden md:block'><MyNavMenu/></div>

                <div className='md:hidden'>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>

                <div className='hidden md:flex flex-row content-center items-center gap-4 lg:gap-8'>
                    {isAuthenticated && (
                        <div className='relative group'>
                            <Heart 
                                size={24} 
                                strokeWidth={1.90} 
                                className='cursor-pointer relative' 
                                onClick={()=>navigate('/cars/favorites')}
                            />
                            {savedPostsData?.length > 0 && (
                                <div className='absolute -top-2 -right-2 size-4 bg-red-500 group-hover:bg-red-400 rounded-full text-xs text-white'>
                                    {savedPostsData?.length}
                                </div>
                            )}
                        </div>
                    )}

                    {!isAuthenticated && (
                        <Button 
                            onClick={() => navigate('/users/login')} 
                            className='text-white bg-red-500 hover:bg-red-400 hover:border-red-400 rounded-xl flex flex-row items-center text-center content-center'
                        >
                            Login
                        </Button>
                    )}

                    {isAuthenticated && (
                        <DropdownMenu>
                            <DropdownMenuTrigger className='hover:border-transparent focus:border-transparent focus:outline-none outline-none'>
                                <Avatar className='cursor-pointer'>
                                    <AvatarImage />
                                    <AvatarFallback className='bg-black text-white font-bold text-lg'>{userData?.username?.[0] || 'U'}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel className='text-xl flex flex-row items-center gap-5'>
                                    <Avatar>
                                        <AvatarImage  />
                                        <AvatarFallback>{userData?.username?.[0] || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p>{userData?.username || 'Loading...'}</p>
                                        <p className='font-light text-sm'>{userData?.email || 'Loading...'}</p>
                                    </div> 
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger className='hover:border-transparent'>
                                                <button className='text-sm font-normal hover:text-red-500 hover:border-transparent flex flex-row items-center' onClick={handleLogout}>
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
                                <DropdownMenuItem className='text-base cursor-pointer hover:bg-gray-200 data-[highlighted]:bg-gray-200 group text-gray-700 flex flex-row justify-between' onClick={()=>{navigate('/cars/favorites')}}><Heart size={30} className='group-hover:text-red-500'/>Favorites cars<Heart size={30} className='text-transparent'/></DropdownMenuItem>
                                <DropdownMenuItem className='text-base cursor-pointer hover:bg-gray-200 data-[highlighted]:bg-gray-200 group text-gray-700 flex flex-row justify-between' onClick={()=>{navigate('/conversations')}}><MessageCircle size={30} className='group-hover:text-red-500'/>Conversations<Heart size={30} className='text-transparent'/></DropdownMenuItem>
                                <DropdownMenuItem className='text-base cursor-pointer hover:bg-gray-200 data-[highlighted]:bg-gray-200 group text-gray-700 flex flex-row justify-between' onClick={()=>{navigate('/posts')}}><Car size={40} className='group-hover:text-red-500'/>My posts<Heart size={30} className='text-transparent'/></DropdownMenuItem>
                                <DropdownMenuItem className='text-base cursor-pointer hover:bg-gray-200 data-[highlighted]:bg-gray-200 group text-gray-700 flex flex-row justify-between' onClick={()=>{navigate('/settings')}}><Settings size={40} className='group-hover:text-red-500'/>Settings<Heart size={30} className='text-transparent'/></DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {mobileMenuOpen && (
                    <div className='md:hidden fixed inset-0 bg-black/50 z-50' onClick={() => setMobileMenuOpen(false)}>
                        <div 
                            className='absolute top-20 right-0 w-64 bg-white shadow-lg p-4 rounded-lg'
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className='flex flex-col space-y-4'>
                                <Button 
                                    variant="ghost" 
                                    className='justify-start' 
                                    onClick={() => {
                                        navigate('/home');
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Home
                                </Button>
                                {isAuthenticated && (
                                    <>
                                        <Button 
                                            variant="ghost" 
                                            className='justify-start' 
                                            onClick={() => {
                                                navigate('/cars/favorites');
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            <Heart className='mr-2' /> Favorite Cars
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            className='justify-start' 
                                            onClick={() => {
                                                navigate('/conversations');
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            <MessageCircle className='mr-2' /> Conversations
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            className='justify-start' 
                                            onClick={() => {
                                                navigate('/posts');
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            <Car className='mr-2' /> My Posts
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            className='justify-start' 
                                            onClick={() => {
                                                navigate('/settings');
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            <Settings className='mr-2' /> Settings
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            className='justify-start text-red-500' 
                                            onClick={handleLogout}
                                        >
                                            <LogOut className='mr-2' /> Logout
                                        </Button>
                                    </>
                                )}
                                {!isAuthenticated && (
                                    <Button 
                                        onClick={() => {
                                            navigate('/users/login');
                                            setMobileMenuOpen(false);
                                        }} 
                                        className='w-full'
                                    >
                                        Login
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header;