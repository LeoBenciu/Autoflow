import Header from '@/components/header'
import Footer from '@/components/footer'
import React, {useEffect, useState} from 'react'
import HeroSection from '@/components/hero-home'
import SecondHome from '@/components/second-home'
import ThirdHome from '@/components/third-home'
import { useNavigate, useLocation } from 'react-router'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/slices/userSlice'

const HomePage = () => {

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{

    const params = new URLSearchParams(location.search);
    const userDataParams = params.get('userData');

    if(userDataParams){
      try{
        const userData = JSON.parse(decodeURIComponent(userDataParams));
        dispatch(setUser(userData.user));
        console.log(userData)
        
        navigate('/home', { replace: true });
      }catch(err){
        console.error('Error parsing user data:', err);
      }
    }

  },[dispatch, location, navigate])

  /* Prevent default for each element else the onClick from the outer div is going to be triggered*/

  return (
      <div className=' container min-w-screen-2xl max-w-screen-2xl min-h-max bg-[var(--background)] mx-auto pl-24 pr-24'>
      <HeroSection></HeroSection>
      <SecondHome></SecondHome>
      <ThirdHome></ThirdHome>
      {isForgotPassword&&(<div className='bg-black/50 inset-0 min-w-full min-h-full z-50 fixed flex justify-center items-center' onClick={(e) => {setIsForgotPassword(false)}}>
        <div className='bg-white rounded-lg min-w-96 min-h-52 max-w-96 max-h-52 flex flex-col justify-between items-center py-5'>
            <h2 className='font-bold text-2xl'>Set new password</h2>
            <input type='password' placeholder='New password' className='min-h-11 max-h-11 min-w-72 max-w-72 rounded-lg bg-white
            border-[1px] border-gray-300 px-4 outline-none'></input>
            <button type='submit' className='min-h-11 max-h-11 min-w-72 max-w-72 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold'>Reset password</button>
        </div>
      </div>)}
      </div>
  )
}

export default HomePage
