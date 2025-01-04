import React, {useState, useRef, useEffect} from 'react'
import PriceMap from './PriceMap';
import Notes from './Notes';
import Details from './Details';
import Financing from './Financing';
import { Calculator, Truck, ShoppingCart, Star, CircleChevronUp, FileCheck2, MessageCircle, X } from 'lucide-react';
import freePlan from '../assets/FreeCarInspection.svg';
import premiumPlan from '../assets/PremiumCarInspection.svg';
import { ComboboxDemo } from '@/schadcn/ComboBox';
import { Calendar } from "@/components/ui/calendar"
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CarDetailedSection = () => {

  const [isCarAuditOpen, setIsCarAuditOpen] = useState(false);
  const [isCarDeliveryOpen, setIsCarDeliveryOpen] = useState(false);
  const [isFreeCarAudit, setIsFreeCarAudit] = useState(true);
  const [isPremiumCarAudit, setIsPremiumCarAudit] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isDate, setIsDate] = useState('Select Date');
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
  const [year, setYear] = useState('');
  const [vinNumber, setVinNumber] = useState('');
  const [currentMileage, setCurrentMileage] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [streetAdress, setStreetAdress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleSubmitForm = ()=>{

  };

  const countries = [
    {
      value: "Romania",
      label: "Romania",
    },
    {
      value: "Hungary",
      label: "Hungary",
    },
    {
      value: "Bulgaria",
      label: "Bulgaria",
    },
    {
      value: "Italy",
      label: "Italy",
    }
  ];
  const calendarRef = useRef();

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

  return (
    <div className='flex flex-row mt-8 min-h-max'>

      {isCarAuditOpen&&(<div className='fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center'>
        <div className='flex flex-col bg-white min-w-[800px] max-w-[40%] min-h-[90%] max-h-[90%] rounded-lg overflow-scroll overflow-x-hidden pb-6'>

          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max p-8'>
            <X size={25} className='cursor-pointer text-red-500' onClick={()=>setIsCarAuditOpen(false)}/>
            <h2 className='font-bold text-3xl'>Request a car audit</h2>
            <X size={25} className='text-transparent' />
          </div>

          <h3 className='text-left font-bold text-xl px-16 mt-5'>Contact details</h3>
          <form>
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
            <Button ref={calendarRef} onClick={()=>setIsCalendarVisible(true)} className='flex-1 shadow-none border-[1px] min-h-11 max-h-11 border-gray-300 font-normal text-base text-gray-400 '>{isDate}
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
          hover:border-transparent mx-auto outline-none focus:outline-none mt-5'>Send Request</button>
          </form>
        </div>
      </div>)}

      {isCarDeliveryOpen&&(<div className='fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center'>
        <div className='flex flex-col bg-white min-w-[800px] max-w-[40%] min-h-[90%] max-h-[90%] rounded-lg overflow-scroll overflow-x-hidden pb-6'>

          <div className='flex flex-row justify-between items-center min-w-full max-w-full min-h-max max-h-max p-8'>
            <X size={25} className='cursor-pointer text-red-500' onClick={()=>setIsCarDeliveryOpen(false)}/>
            <h2 className='font-bold text-3xl'>Car Delivery</h2>
            <X size={25} className='text-transparent' />
          </div>

          <h3 className='text-left font-bold text-xl px-16 mt-5'>Contact details</h3>
          <form>
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
            <Button ref={calendarRef} onClick={()=>setIsCalendarVisibleDelivery1(true)} className='flex-1 shadow-none border-[1px] min-h-11 max-h-11 border-gray-300 font-normal text-base text-gray-400 '>{isDateDelivery1}
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
            <Button ref={calendarRef} onClick={()=>setIsCalendarVisibleDelivery2(true)} className='flex-1 shadow-none border-[1px] min-h-11 max-h-11 border-gray-300 font-normal text-base text-gray-400 '>{isDateDelivery2}
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
          hover:border-transparent mx-auto outline-none focus:outline-none mt-5'>Send Request</button>

          </form>

        </div>
      </div>)}
      <div className='flex flex-col flex-1 h-[100rem] px-9 min-h-max'>
        <Details></Details>
        <Notes></Notes>
        <PriceMap></PriceMap>
        <Financing></Financing>
      </div>
      <div className='w-96 h-max sticky top-24'>
        <div className='bg-white h-max rounded-lg flex flex-col'>
          <div className='bg-green-100 min-w-full h-8 rounded-t-lg flex flex-row items-center text-green-600 font-bold justify-center'>
            <p>Top offer</p>
          </div>
          <div className='p-7'>
          <div className='flex flex-row justify-between'>
            <h3 className='font-bold text-2xl'>Car price</h3>
            <h3 className='font-bold text-2xl'>10,234€</h3>
          </div>
          <div className='bg-gradient-to-r from-red-500 to-red-700 flex flex-row gap-3 justify-center items-center py-4 rounded-sm text-white mt-4 font-bold cursor-pointer hover:shadow-lg'><MessageCircle size={25} /> Message seller</div>
          <a className='border-[1px] border-red-500 flex flex-row gap-3 justify-center items-center py-4 rounded-sm text-red-500 mt-4 font-bold cursor-pointer hover:bg-red-100 hover:text-red-500' href='#Financing'><Calculator size={25} /> Financing</a>
          <div className='flex flex-row min-w-full gap-2'> 
          <div className='border-[1px] border-red-500 flex flex-row gap-3 justify-center items-center py-4 rounded-sm text-red-500 mt-4 font-bold cursor-pointer hover:bg-red-100 hover:text-red-500 flex-1' onClick={()=>{setIsCarAuditOpen(true)}}><FileCheck2 size={25} />Car audit</div>
          <div className='border-[1px] border-red-500 flex flex-row gap-3 justify-center items-center py-4 rounded-sm text-red-500 mt-4 font-bold cursor-pointer hover:bg-red-100 hover:text-red-500 flex-1' onClick={()=>{setIsCarDeliveryOpen(true)}}><Truck size={25} />Car delivery</div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetailedSection;
