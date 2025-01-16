import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import googleLogo from "../assets/google-icon-logo-svgrepo-com.svg"
import { useLoginMutation } from "@/redux/slices/apiSlice"
import { useState } from "react"
import { useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/slices/userSlice"
import { useSelector } from "react-redux"

export function LoginForm({
  className,
  setIsForgotPassword,
  ...props
}) {

  const [validationErrors, setValidationErrors] = useState({});
  const [login, {isLoading}] = useLoginMutation({
    credentials: 'include'
  });

  const [formData,setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {userData, isAuthenticated} = useSelector(state=>state.user);

  const handleSubmitForm = async(e) =>{
    e.preventDefault();
    setValidationErrors({});
    try{
      const user = await login(formData).unwrap();
      console.log('Successful Login', user);
      dispatch(setUser(user));
  
      navigate('/home');
    }catch(err){
      console.error('Failed to login:', err);
      if (err.data?.errors) {
        const errorMessages = {};
        err.data.errors.forEach(error => {
            errorMessages[error.path] = error.msg;
        });
        setValidationErrors(errorMessages);
    } else if (typeof err.data === 'string') {
        setValidationErrors({
            general: err.data
        });
    } else {
        setValidationErrors({
            general: 'Login failed. Please check your credentials and try again.'
        });
    }
    }

  }

  const handleGoogleLogin=()=>{
    window.location.href = 'http://localhost:3000/users/auth/google';
  }

  return (
    (<form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmitForm}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
        {validationErrors.general && (
                <p className="text-red-500 text-sm">{validationErrors.general}</p>
            )}
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="example@example.com" required onChange={handleChange} value={formData.email}/>
          {validationErrors.email && (
                    <p className="text-red-500 text-sm">{validationErrors.email}</p>
                )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a className="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer" onClick={() => setIsForgotPassword(true)}>
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required onChange={handleChange} value={formData.password} />
          {validationErrors.password && (
                    <p className="text-red-500 text-sm">{validationErrors.password}</p>
                )}
        </div>
        <Button type="submit" className="w-full bg-red-600 hover:text-black" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
        </Button>
        <div
          className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-white px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
          <img src={googleLogo} className="size-5"/>
          Login with Google
        </Button>
      </div>
    </form>)
  );
}
