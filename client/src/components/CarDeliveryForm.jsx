import React from 'react'
import { useState } from 'react';
import { X } from 'lucide-react';
import { ComboboxDemo } from '@/schadcn/ComboBox';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { countries } from '@/app/Lists';

const CarDeliveryForm = ({calendarRef, setIsCarDeliveryOpen}) => {

      const [isCalendarVisibleDelivery1, setIsCalendarVisibleDelivery1] = useState(false);
      const [isDateDelivery1, setIsDateDelivery1] = useState('Select Date');
      const [isCalendarVisibleDelivery2, setIsCalendarVisibleDelivery2] = useState(false);
      const [isDateDelivery2, setIsDateDelivery2] = useState('Select Date');
    
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
      const [email, setEmail] = useState('');
      const [phoneNumber, setPhoneNumber] = useState('');
      const [make, setMake] = useState('');
      const [model, setModel] = useState('');
      const [vinNumber, setVinNumber] = useState('');
      const [currentMileage, setCurrentMileage] = useState('');
      const [country, setCountry] = useState('');
      const [state, setState] = useState('');
      const [city, setCity] = useState('');
      const [streetAdress, setStreetAdress] = useState('');
      const [postalCode, setPostalCode] = useState('');
    
      const handleDateSelectDelivery1 = (selectedDate) => {
        try {
            if (selectedDate) {
                setIsDateDelivery1(selectedDate.toLocaleDateString());
            }
            setIsCalendarVisibleDelivery1(false);
        } catch (error) {
            console.error('Date selection error:', error);
            setIsDateDelivery1('');
        }
      };
      
      const handleDateSelectDelivery2 = (selectedDate) => {
        try {
            if (selectedDate) {
                setIsDateDelivery2(selectedDate.toLocaleDateString());
            }
            setIsCalendarVisibleDelivery2(false);
        } catch (error) {
            console.error('Date selection error:', error);
            setIsDateDelivery2('');
        }
      };

      const handleSubmit = ()=>{
        setIsCarDeliveryOpen(false);
      };
    
  return (
    <div className='fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center'>
        <div className='flex flex-col bg-white min-w-[800px] max-w-[40%] min-h-[90%] max-h-[90%] rounded-lg overflow-scroll overflow-x-hidden pb-6'>

          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max p-8'>
            <X size={25} className='cursor-pointer text-red-500' onClick={()=>setIsCarDeliveryOpen(false)}/>
            <h2 className='font-bold text-3xl'>Car Delivery</h2>
            <X size={25} className='text-transparent' />
          </div>

          <h3 className='text-left font-bold text-xl px-16 mt-5'>Contact details</h3>
          <form onSubmit={handleSubmit}>
          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max px-16 py-4 gap-10'>
            <input type='text' placeholder='First Name' required value={firstName} onChange={(e)=>setFirstName(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
            <input type='text' placeholder='Last Name' required value={lastName} onChange={(e)=>setLastName(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
          </div>
          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max px-16 py-4 gap-10'>
            <input type='text' placeholder='Email' required value={email} onChange={(e)=>setEmail(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
            <input type='text' placeholder='Phone Number' required value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
          </div>



          <h3 className='text-left font-bold text-xl px-16 mt-5'>Vehicle details</h3>

          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max px-16 py-4 gap-10'>
            <input type='text' placeholder='Make' value={make} onChange={(e)=>setMake(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
            <input type='text' placeholder='Model' value={model} onChange={(e)=>setModel(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>          
          </div>
            
          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max px-16 py-4 gap-10'>
          <input type='text' placeholder='VIN Number' required value={vinNumber} onChange={(e)=>setVinNumber(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
          <input type='text' placeholder='Color' value={currentMileage} onChange={(e)=>setCurrentMileage(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
          </div>

          <h3 className='text-left font-bold text-xl px-16 mt-5'>Delivery Location</h3>

          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max px-16 py-4 gap-10'>
            <ComboboxDemo select='Country' required value={country} onChange={(e)=>setCountry(e.target.value)} list={countries} ></ComboboxDemo>
            <ComboboxDemo select='State' required value={state} onChange={(e)=>setState(e.target.value)} list={countries} ></ComboboxDemo>
            <input type='text' placeholder='City' required value={city} onChange={(e)=>setCity(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
          </div>

          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max px-16 py-4 gap-10'>
            <input type='text' placeholder='Street Adress' required value={streetAdress} onChange={(e)=>setStreetAdress(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 min-w-80 max-w-80 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
            <input type='text' placeholder='Postal Code' required value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} className='border-[1px] flex-1 border-gray-300 rounded-lg p-2 min-w-80 max-w-60 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
          </div>


          <h3 className='text-left font-bold text-xl px-16 mt-5'>Delivery Scheduling</h3>

          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max px-16 py-4 gap-10'>
          <div className='relative'>
            <Button ref={calendarRef} type="button" onClick={()=>setIsCalendarVisibleDelivery1(true)} className='flex-1 shadow-none border-[1px] min-h-11 max-h-11 border-gray-300 font-normal text-base text-gray-400 '>{isDateDelivery1}
            </Button>
            {isCalendarVisibleDelivery1&&(<Calendar
              mode="single"
              required
              selected={isDateDelivery1}
              onSelect={handleDateSelectDelivery1}
              className="rounded-md border absolute z-50 bg-white bottom-0 right-0"
            />)}
            </div>    
            <Select className="flex-1">          
            <SelectTrigger className="w-[180px] bg-white text-black border-gray-300 min-h-11 max-h-11">
                <SelectValue placeholder="Time window" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Morning</SelectItem>
                <SelectItem value="option2">Afternoon</SelectItem>
                <SelectItem value="option3">Evening</SelectItem>
              </SelectContent>
            </Select>
          
          <div className='relative'>
            <Button ref={calendarRef} type="button" onClick={()=>setIsCalendarVisibleDelivery2(true)} className='flex-1 shadow-none border-[1px] min-h-11 max-h-11 border-gray-300 font-normal text-base text-gray-400 '>{isDateDelivery2}
            </Button>
            {isCalendarVisibleDelivery2&&(<Calendar
              mode="single"
              required
              selected={isDateDelivery2}
              onSelect={handleDateSelectDelivery2}
              className="rounded-md border absolute z-50 bg-white bottom-0 right-0"
            />)}
            </div>    
            <Select className="flex-1">          
            <SelectTrigger className="w-[180px] bg-white text-black border-gray-300 min-h-11 max-h-11">
                <SelectValue placeholder="Time window" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Morning</SelectItem>
                <SelectItem value="option2">Afternoon</SelectItem>
                <SelectItem value="option3">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button className='min-h-10 max-h-10 min-w-52 max-w-52 px-4 rounded-full bg-red-500 font-bold text-white hover:text-red-500 hover:bg-red-200 border-transparent 
          hover:border-transparent mx-auto outline-none focus:outline-none mt-5' type='submit'>Send Request</button>

          </form>

        </div>
      </div>
  )
}

export default CarDeliveryForm;
