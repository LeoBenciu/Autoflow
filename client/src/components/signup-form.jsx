import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import googleLogo from '../assets/google-icon-logo-svgrepo-com.svg'
import { useSignupMutation } from "@/redux/slices/apiSlice"
import { useState } from "react"
import { CircleCheck, UserRound } from "lucide-react"
import { useNavigate } from "react-router"

export function SignupForm({
  className,
  onSuccessfulSignup,
  ...props
}) {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});

  const [formData,setFormData] = useState({
    email: '',
    username: '',
    phone: '',
    password: '',
  });

  const [goodSignup,setGoodSignup] = useState(false);

  const [signup, {isLoading}] = useSignupMutation();

  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();
    setValidationErrors({});
    try{
      const user = await signup(formData).unwrap();
      console.log('Signup successful:', user);
      setGoodSignup(true);
    }catch(err){
      console.error('Failed to signup:', err);

      if (err.data?.errors) {
        const errorMessages = {};
        err.data.errors.forEach(error => {
            errorMessages[error.path] = error.msg;
        });
        setValidationErrors(errorMessages);
    } else if (typeof err.data === 'string') {
        setValidationErrors({
            email: err.data
        });
    } else {
        setValidationErrors({
            general: 'An unexpected error occurred. Please try again.'
        });
    }
    }
  };

  const handleGoogleSignup=()=>{
    window.location.href = 'http://localhost:3000/users/auth/google';
  }

  return (
    (<form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your details below to create an account
        </p>
        {validationErrors.general && (
            <p className="text-red-500 text-sm text-center">{validationErrors.general}</p>
        )}
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="example@example.com" required onChange={handleChange}
          value={formData.email}/>
          {validationErrors.email&&(
            <p className="text-red-500 text-sm">{validationErrors.email}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="username" required onChange={handleChange}
          value={formData.username}/>
          {validationErrors.username&&(
            <p className="text-red-500 text-sm">{validationErrors.username}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="phone" required onChange={handleChange}
          value={formData.phone}/>
          {validationErrors.phone&&(
            <p className="text-red-500 text-sm">{validationErrors.phone}</p>
          )}
        </div>

        <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required onChange={handleChange}
          value={formData.password}/>
          {validationErrors.password&&(
            <p className="text-red-500 text-sm">{validationErrors.password}</p>
          )}
        </div>

        <Button type="submit" className="w-full bg-red-600 hover:text-black" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Signup'}
        </Button>
        <div
          className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-white px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignup}>
          <img src={googleLogo} className="size-5"/>
          Signup with Google
        </Button>
        <Button variant="outline" className="w-full" onClick={()=>navigate('/home')}>
          <UserRound size={5}/>
          Continue as guest
        </Button>
      </div>
      {goodSignup&&(
      <div className="fixed inset-0 bg-black/50 min-w-screen min-h-screen z-20 flex items-center justify-center">
        <div className="bg-white p-8 rounded-md flex flex-col gap-4 items-center">
          <CircleCheck size={80} className="text-green-500"></CircleCheck>
          <p className="text-2xl font-bold">Account successfully created</p>
          <button  onClick={()=>{setGoodSignup(false); onSuccessfulSignup();}}
            className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-500
            hover:to-red-500 text-white rounded-lg px-8 py-2 font-semibold hover:shadow-md">Go to login</button>
        </div>
      </div>
      )}
    </form>)
  );
}
