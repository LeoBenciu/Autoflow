import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CircleUser, Lock, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';



const SettingsPage = () => {

  const countries = [];
  const states = [];

  const CustomSelect = ({ placeholder, arrayOfValues, required, disabled }) => (
    <Select required={required} disabled={disabled? true: false}>
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

  return (
    <div className=' container min-w-screen-2xl max-w-screen-2xl min-h-max bg-[var(--background)] mx-auto px-24 flex items-center justify-center '>
    <div className='min-w-[800px] max-w-[800px] min-h-4 mt-10'>
      <h1 className="text-3xl font-extrabold mb-8 text-left">Settings</h1>
      <Accordion type="single" collapsible className='bg-white rounded-lg px-4 container'>
        <AccordionItem value="item-1" className='border-b-0'>
          <AccordionTrigger className=' hover:no-underline text-xl font-bold'><span className='flex flex-row gap-5'><CircleUser size={28} className='text-red-500'/>Personal informations</span></AccordionTrigger>
          <AccordionContent>
            <form className='min-h-max py-5 flex flex-col items-center justify-center'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 min-w-max max-w-max'>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>Username</Label>
              <Input id='username' type='username' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none  min-w-52 max-w-52">
              </Input>
              </div>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>Email</Label>
              <Input id='email' type='email' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none min-w-52 max-w-52">
              </Input>
              </div>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>Phone</Label>
              <Input id='phone' type='phone' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none  min-w-52 max-w-52">
              </Input>
              </div>
              </div>

              <div className='flex flex-row items-center justify-end min-w-full px-10'>
                <button className='bg-red-500 rounded-lg text-white text-base font-bold 
                py-2 px-6'>Save Changes</button>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible className='bg-white rounded-lg px-4 mt-8'>
        <AccordionItem value="item-2" className='border-b-0'>
          <AccordionTrigger className=' hover:no-underline text-xl font-bold'><span className='flex flex-row gap-5'><Lock size={28} className='text-red-500'/>Change password</span></AccordionTrigger>
          <AccordionContent >
          <form className='min-h-max py-5 flex flex-col items-center justify-center'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 min-w-max max-w-max'>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>Old password</Label>
              <Input id='password' type='password' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none  min-w-52 max-w-52">
              </Input>
              </div>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>New password</Label>
              <Input id='password' type='password' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none min-w-52 max-w-52">
              </Input>
              </div>
              </div>

              <div className='flex flex-row items-center justify-end min-w-full px-10'>
                <button className='bg-red-500 rounded-lg text-white text-base font-bold 
                py-2 px-6'>Save new password</button>
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
              <CustomSelect placeholder="Select country"  id='country' arrayOfValues={countries} required />
              </div>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>State</Label>
              <CustomSelect placeholder="Select state"  id='state' arrayOfValues={states} required />
              </div>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>City</Label>
              <Input id='city' type='city' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none  min-w-52 max-w-52">
              </Input>
              </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 min-w-max max-w-max'>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>Zip code</Label>
              <Input id='zip code' type='zip code' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none  min-w-52 max-w-52">
              </Input>
              </div>
              <div className='space-y-2 flex flex-col items-start justify-center'>
              <Label htmlFor='username'>Street address</Label>
              <Input id='street address' type='text' required
               className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
               focus:outline-none min-w-80 max-w-80">
              </Input>
              </div>
              </div>

              <div className='flex flex-row items-center justify-end min-w-full px-10'>
                <button className='bg-red-500 rounded-lg text-white text-base font-bold 
                py-2 px-6'>Save Changes</button>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
    </div>
  )
}

export default SettingsPage
