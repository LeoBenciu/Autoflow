import image from '../../assets/pozabuna.png'
import logoImage from '../../assets/AutoFlow.svg'
import MyTabs from '@/schadcn/MyTabs';
import { LoginForm } from '@/components/login-form';
import { SignupForm } from '@/components/signup-form';

export default function LoginPage() {
  return (
    (<div className="grid min-h-svh lg:grid-cols-2 bg-white">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
              <img src={logoImage} className='size-6'/>
            AutoFlow
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <MyTabs content1={<LoginForm />}
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
    </div>)
  );
}
