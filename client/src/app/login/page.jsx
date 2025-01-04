import image from '../../assets/pozabuna.png'
import logoImage from '../../assets/AutoFlow.svg'
import MyTabs from '@/schadcn/MyTabs';
import { LoginForm } from '@/components/login-form';
import { SignupForm } from '@/components/signup-form';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function LoginPage() {

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return (
    (<div className="grid min-h-svh lg:grid-cols-2 bg-white relative">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
              <img src={logoImage} className='size-6'/>
            AutoFlow
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <MyTabs content1={<LoginForm setIsForgotPassword={setIsForgotPassword} />}
            content2={<SignupForm/>}
            ></MyTabs>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted min-w-full min-h-full lg:block">
        <img
          src={image}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
      </div>

      {isForgotPassword&&(<div className='absolute inset-0 bg-black/70 z-30 flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4 bg-white rounded-xl p-4 min-w-[28rem] min-h-64'>
          <div className='flex flex-row items-center justify-between min-w-full min-h-max max-h-max'>
            <X size={20} className='text-transparent'></X>
            <h1 className='text-2xl font-bold'>Forgot your password?</h1>
            <X size={20} className='text-red-500 hover:text-black cursor-pointer' onClick={()=>setIsForgotPassword(false)}></X>
          </div>
          <p className='text-sm'>No worries. We'll send you a link to reset your password.</p>
          <form className='mt-5 min-w-full px-6'>
            <input type='email' placeholder='Email' required className='min-w-full min-h-9 max-h-9 bg-white border-[1px] border-gray-300 rounded-md 
            outline-none focus:outline-none px-3'></input>
            <button type='submit' className='mt-7 min-h-9 max-h-9 min-w-full border-none bg-gradient-to-r from-red-500 to-red-700 hover:from-red-500 hover:to-red-500 hover:shadow-lg text-white font-medium '>Reset password</button>
          </form>
        </div>
      </div>)}

    </div>)
  );
}
