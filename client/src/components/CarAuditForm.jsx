import React from 'react'
import { useState } from 'react';
import { X } from 'lucide-react';
import freePlan from '../assets/FreeCarInspection.svg';
import premiumPlan from '../assets/PremiumCarInspection.svg';
import { ComboboxDemo } from '@/schadcn/ComboBox';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar"
import { countries } from '@/app/Lists';


const CarAuditForm = ({calendarRef, setIsCarAuditOpen}) => {

      const [isFreeCarAudit, setIsFreeCarAudit] = useState(true);
      const [isPremiumCarAudit, setIsPremiumCarAudit] = useState(false);
      const [isCalendarVisible, setIsCalendarVisible] = useState(false);
      const [isDate, setIsDate] = useState('Select Date');
    
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
      const [email, setEmail] = useState('');
      const [phoneNumber, setPhoneNumber] = useState('');
      const [make, setMake] = useState('');
      const [model, setModel] = useState('');
      const [year, setYear] = useState('');
      const [vinNumber, setVinNumber] = useState('');
      const [currentMileage, setCurrentMileage] = useState('');
      const [country, setCountry] = useState('');
      const [state, setState] = useState('');
      const [city, setCity] = useState('');
      const [streetAdress, setStreetAdress] = useState('');
      const [postalCode, setPostalCode] = useState('');

        const handleDateSelect = (selectedDate) => {
    try {
        if (selectedDate) {
            setIsDate(selectedDate.toLocaleDateString());
        }
        setIsCalendarVisible(false);
    } catch (error) {
        console.error('Date selection error:', error);
        setIsDate('');
    }
};

    const handleSubmit = ()=>{
        setIsCarAuditOpen(false);
    };

  return (
    <div className='fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center'>
        <div className='flex flex-col bg-white min-w-[800px] max-w-[40%] min-h-[90%] max-h-[90%] rounded-lg overflow-scroll overflow-x-hidden pb-6'>

          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max p-8'>
            <X size={25} className='cursor-pointer text-red-500' onClick={()=>setIsCarAuditOpen(false)}/>
            <h2 className='font-bold text-3xl'>Request a car audit</h2>
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
            <input type='text' placeholder='Year' value={year} onChange={(e)=>setYear(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
          </div>
          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max px-16 py-4 gap-10'>
            <input type='text' placeholder='VIN Number' required value={vinNumber} onChange={(e)=>setVinNumber(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
            <input type='text' placeholder='Current Mileage' value={currentMileage} onChange={(e)=>setCurrentMileage(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
          </div>

          <h3 className='text-left font-bold text-xl px-16 mt-5'>Audit preferences</h3>
          <div className='flex flex-row justify-center items-center min-w-full max-w-full min-h-max max-h-max px-16 py-4 gap-20'>

            <div className={`flex flex-col flex-1 items-center min-w-[257px] max-w-[257px] [box-shadow:0_8px_30px_rgb(0,0,0,0.12)] rounded-lg p-8 cursor-pointer hover:[box-shadow:0_8px_30px_rgb(240,0,0,0.2)] 
              ${isFreeCarAudit?'bg-red-500 text-white':''} relative`} 
              onClick={() => {
              if (isFreeCarAudit) {
                  setIsFreeCarAudit(false);
                  setIsPremiumCarAudit(false);
                } else {
                  setIsFreeCarAudit(true);
                  setIsPremiumCarAudit(false);
                }
              }}>
              <img src={freePlan} alt="car inspection" className='w-36 h-20'/>
              <h1 className={`text-4xl font-bold text-red-500 ${isFreeCarAudit?'bg-red-500 text-white':''}`}>0€</h1>
              <h2 className='text-xl font-bold mb-5 mt-3'>Free Inspection</h2>
              <ul className='list-disc flex flex-col items-center justify-center'>
                <li>Visual exterior inspection</li>
                <li>Basic engine check</li>
                <li>Test drive (15 min)</li>
                <li>Interior review</li>
                <li>Safety features test</li>
                <li>Written technical report</li>
              </ul>
            </div>

            <div className={`flex flex-col flex-1 items-center min-w-[257px] max-w-[257px] [box-shadow:0_8px_30px_rgb(0,0,0,0.12)] rounded-lg p-8 cursor-pointer hover:[box-shadow:0_8px_30px_rgb(240,0,0,0.2)] 
            ${isPremiumCarAudit?'bg-red-500 text-white':''}`} 
            onClick={() => {
            if (isPremiumCarAudit) {
                setIsPremiumCarAudit(false);
                setIsFreeCarAudit(false);
              } else {
                setIsPremiumCarAudit(true);
                setIsFreeCarAudit(false);
              }
            }}>
            <img src={premiumPlan} alt="car audit" className='w-44 h-20'/>
              <h1 className={`text-4xl font-bold text-red-500 ${isPremiumCarAudit?'bg-red-500 text-white':''}`}>49€</h1>
              <h2 className='text-xl font-bold mb-5 mt-3'>Premium Inspection</h2>
              <ul className='list-disc flex flex-col items-center justify-center'>
                <li>All Basic features plus:</li>
                <li>Diagnostic computer scan</li>
                <li>Undercarriage check</li>
                <li>Fluid levels analysis</li>
                <li>Detailed photo report</li>
                <li>Estimated repair costs</li>
              </ul>
            </div>
          </div>

          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max px-16 py-4 gap-10'>
            <ComboboxDemo select='Country' required value={country} onChange={(e)=>setCountry(e.target.value)} list={countries} ></ComboboxDemo>
            <ComboboxDemo select='State' required value={state} onChange={(e)=>setState(e.target.value)} list={countries} ></ComboboxDemo>
            <input type='text' placeholder='City' required value={city} onChange={(e)=>setCity(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 flex-1 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
          </div>

          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max px-16 py-4 gap-10'>
            <input type='text' placeholder='Street Adress' required value={streetAdress} onChange={(e)=>setStreetAdress(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 min-w-72 max-w-72 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
            <input type='text' placeholder='Postal Code' required value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} className='border-[1px] border-gray-300 rounded-lg p-2 min-w-32 max-w-32 text-black bg-white focus:outline-none outline-none focus:border-red-500'/>
            <div className='relative'>
            <Button ref={calendarRef} type="button" onClick={()=>{setIsCalendarVisible(true)}} className='flex-1 shadow-none border-[1px] min-h-11 max-h-11 border-gray-300 font-normal text-base text-gray-400 '>{isDate}
            </Button>
            {isCalendarVisible&&(<Calendar
              mode="single"
              required
              selected={isDate}
              onSelect={handleDateSelect}
              className="rounded-md border absolute z-50 bg-white bottom-0 right-0"
            />)}
            </div>
          </div>

          <button className='min-h-10 max-h-10 min-w-52 max-w-52 px-4 rounded-full bg-red-500 font-bold text-white hover:text-red-500 hover:bg-red-200 border-transparent 
          hover:border-transparent mx-auto outline-none focus:outline-none mt-5' type='submit'>Send Request</button>
          </form>
        </div>
      </div>
  )
}

export default CarAuditForm
