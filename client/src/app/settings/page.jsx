import React, { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CircleUser, Lock, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDispatch, useSelector } from 'react-redux';
import { countries, states } from '../Lists';
import { useChangeUserDetailsMutation, useChangeUserLocationDetailsMutation, useDeleteAccountMutation, useGetUserDetailsQuery } from '@/redux/slices/apiSlice';
import { clearUser, setUser } from '@/redux/slices/userSlice';
import { useNavigate } from 'react-router';


const SettingsPage = () => {

  const navigate = useNavigate();
  const [userFormData, setUserFormData]= useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });

  const [locationFormData, setLocationFormData]=useState({
    country: '',
    state: '',
    city: '',
    zip_code: '',
    street_address:''
  });

  const dispatch = useDispatch();
  const {data, isLoading, error} = useGetUserDetailsQuery();
  const [deleteUser, {isDeleteUserLoading}] = useDeleteAccountMutation();
  const {userData} = useSelector(state=> state.user);
  const [updateUser, {isUserDetailsLoading}] = useChangeUserDetailsMutation({
    credentials:'include'
  });

  const [updateLocation, {isLocationDetailsLoading}] = useChangeUserLocationDetailsMutation({
    data:'include'
  })

  useEffect(()=>{
    if(!isLoading){if(data && data[0]){
    dispatch(setUser(data[0]));
    }}
  },[data]);

  useEffect(()=>{
   if(userData){
    setUserFormData({
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
    });
    setLocationFormData({
      country: userData.country,
      state: userData.state,
      city: userData.city,
      zip_code: userData.zip_code,
      street_address:userData.street_address
    });}
  },[userData])

  const CustomSelect = ({ placeholder, arrayOfValues, required, disabled, onValueChange, value }) => (
    <Select required={required} disabled={disabled? true: false} onValueChange={onValueChange}
    value={value}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {arrayOfValues.map((value) => (
          <SelectItem key={value} value={value}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const handleUserChanges = async(e) =>{
    e.preventDefault();
    try{
      const result = await updateUser(userFormData).unwrap();
      dispatch(setUser(result.user))
      console.log('New User Data:', result.user);
      navigate(0);
    }catch(err){
      console.error('Failed to save changes:',err);
    }
  };

  const handleLocationChanges = async(e)=>{
    e.preventDefault();
    try{
      const result = await updateLocation(locationFormData).unwrap();
      dispatch(setUser(result.location));
      console.log('New Location Data:', result.location);
      navigate(0);
    }catch(err){
      console.error('Failed to save location changes:', err);
    }
  };

  const handleCancelAccount = async(e)=>{
    e.preventDefault();
    try{
      await deleteUser().unwrap();
      dispatch(clearUser())
      navigate('/home');
    }catch(err){
      console.error('Failed to delete the account:',err);
    }
  };

  return (
    <div className=' container min-w-screen-2xl max-w-screen-2xl min-h-max bg-[var(--background)] mx-auto px-24 flex items-center justify-center '>
    <div className='min-w-[800px] max-w-[800px] min-h-4 mt-10'>
      <h1 className="text-3xl font-extrabold mb-8 text-left">Settings</h1>
      <Accordion type="single" collapsible className='bg-white rounded-lg px-4 container'>
        <AccordionItem value="item-1" className='border-b-0'>
          <AccordionTrigger className=' hover:no-underline text-xl font-bold'><span className='flex flex-row gap-5'>
            <CircleUser size={28} className='text-red-500'/>Personal informations</span></AccordionTrigger>
          <AccordionContent>
            <form className='min-h-max py-5 flex flex-col items-center justify-center'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 min-w-max max-w-max'>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>Username</Label>
              <Input id='username' type='username' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none  min-w-52 max-w-52" value={userFormData.username} onChange={(e)=>{
                setUserFormData({
                  ...userFormData,
                  username: e.target.value
                })
               }}>
              </Input>
              </div>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none min-w-52 max-w-52" value={userFormData.email} onChange={(e)=>{
                setUserFormData({
                  ...userFormData,
                  email: e.target.value
                })
               }}>
              </Input>
              </div>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='phone'>Phone</Label>
              <Input id='phone' type='phone' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none  min-w-52 max-w-52" value={userFormData.phone} onChange={(e)=>{
                setUserFormData({
                  ...userFormData,
                  phone: e.target.value
                })
               }}>
              </Input>
              </div>
              </div>

              <div className='flex flex-row items-center justify-end min-w-full px-10'>
                <button className='bg-red-500 rounded-lg text-white text-base font-bold 
                py-2 px-6' onClick={handleUserChanges}>Save Changes</button>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className='bg-white rounded-lg px-4 mt-8'>
        <AccordionItem value="item-2" className='border-b-0'>
          <AccordionTrigger className=' hover:no-underline text-xl font-bold'><span className='flex flex-row gap-5'>
            <Lock size={28} className='text-red-500'/>Change password</span></AccordionTrigger>
          <AccordionContent >
          <form className='min-h-max py-5 flex flex-col items-center justify-center'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 min-w-max max-w-max'>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>New password</Label>
              <Input id='password' type='password' required value={userFormData.password} onChange={(e)=>{
                setUserFormData({
                  ...userFormData,
                  password: e.target.value
                })
              }}
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none min-w-52 max-w-52">
              </Input>
              </div>
              </div>

              <div className='flex flex-row items-center justify-end min-w-full px-10'>
                <button className='bg-red-500 rounded-lg text-white text-base font-bold 
                py-2 px-6' onClick={handleUserChanges}>Save new password</button>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className='bg-white rounded-lg px-4 mt-8'>
        <AccordionItem value="item-2" className='border-b-0'>
          <AccordionTrigger className=' hover:no-underline text-xl font-bold'><span className='flex flex-row gap-5'><MapPin size={28} className='text-red-500'/>Default location details</span></AccordionTrigger>
          <AccordionContent >
          <form className='min-h-max py-5 flex flex-col items-center justify-center'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 min-w-max max-w-max'>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='country'>Country</Label>
              <CustomSelect placeholder="Select country"  id='country' arrayOfValues={countries} required 
              onValueChange={(value)=>setLocationFormData({
                ...locationFormData,
                country: value
              })} value={locationFormData.country}/>
              </div>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>State</Label>
              <CustomSelect placeholder="Select state"  id='state' arrayOfValues={locationFormData.country ? states[locationFormData.country]: []}  
              required onValueChange={(value)=>setLocationFormData({
                ...locationFormData,
                state: value
              })} value={locationFormData.state}
              disabled={locationFormData.country?.length<1? true : false}/>
              </div>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>City</Label>
              <Input id='city' type='city' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none  min-w-52 max-w-52" value={locationFormData.city} onChange={(e)=>{
                setLocationFormData({
                  ...locationFormData,
                  city: e.target.value
                })
               }}>
              </Input>
              </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 min-w-max max-w-max'>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>Zip code</Label>
              <Input id='zip code' type='zip code' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none  min-w-52 max-w-52" value={locationFormData.zip_code} onChange={(e)=>{
                setLocationFormData({
                  ...locationFormData,
                  zip_code: e.target.value
                })
               }}>
              </Input>
              </div>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>Street address</Label>
              <Input id='street address' type='text' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none min-w-80 max-w-80" value={locationFormData.street_address} onChange={(e)=>{
                setLocationFormData({
                  ...locationFormData,
                  street_address: e.target.value
                })
               }}>
              </Input>
              </div>
              </div>

              <div className='flex flex-row items-center justify-end min-w-full px-10'>
                <button className='bg-red-500 rounded-lg text-white text-base font-bold 
                py-2 px-6' onClick={handleLocationChanges}>Save Changes</button>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <AlertDialog>
        <AlertDialogTrigger  className='mt-10 bg-red-500 rounded-lg 
        px-10 py-2 font-semibold text-white
        '>Cancel account</AlertDialogTrigger>
        <AlertDialogContent className='bg-white'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='bg-green-500 hover:bg-green-600 border-none
            text-white hover:text-white'>Cancel</AlertDialogCancel>
            <AlertDialogAction className='bg-red-500 hover:bg-red-600 hover:text-white' onClick={handleCancelAccount}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </div>
  )
}

export default SettingsPage
