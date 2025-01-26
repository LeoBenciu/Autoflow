import React, {useState, useRef, useEffect} from 'react'
import PriceMap from './PriceMap';
import Notes from './Notes';
import Details from './Details';
import Financing from './Financing';
import { Calculator, Truck, FileCheck2, MessageCircle, X,StickyNote } from 'lucide-react';
import CarAuditForm from './CarAuditForm';
import CarDeliveryForm from './CarDeliveryForm';
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { useCreateConversationMutation } from '@/redux/slices/apiSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const CarDetailedSection = ({data}) => {

  const [isCarAuditOpen, setIsCarAuditOpen] = useState(false);
  const [isCarDeliveryOpen, setIsCarDeliveryOpen] = useState(false);
  const [createConversation] = useCreateConversationMutation();
  const calendarRef = useRef();
  const userId = useSelector(state=>state.user.userData.id);
  const navigate = useNavigate();

const formatEuro = (amount) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

const isSameUser= data?.user_id ===userId? true: false;

  return (
    <div className='flex flex-row mt-8 min-h-max'>

      {isCarAuditOpen&&(<CarAuditForm calendarRef={calendarRef} setIsCarAuditOpen={setIsCarAuditOpen}/>)}

      {isCarDeliveryOpen&&(<CarDeliveryForm calendarRef={calendarRef} setIsCarDeliveryOpen={setIsCarDeliveryOpen}/>)}
      
      <div className='flex flex-col flex-1 h-[100rem] px-9 min-h-max'>
        <Details data={data}></Details>
        {data?.notes&&(<Notes data={data}></Notes>)}
        <PriceMap data={data}></PriceMap>
        <Financing data={data}></Financing>
      </div>
      <div className='w-96 h-max sticky top-24'>
        <div className='bg-white h-max rounded-lg flex flex-col'>
          <div className='bg-green-100 min-w-full h-8 rounded-t-lg flex flex-row items-center text-green-600 font-bold justify-center'>
            <p>Top offer</p>
          </div>
          <div className='p-7'>
          <div className='flex flex-row justify-between'>
            <h3 className='font-bold text-2xl'>Car price</h3>
            <h3 className='font-bold text-2xl'>{formatEuro(data?.price)}</h3>
          </div>
          {isSameUser&&(<div className='bg-gradient-to-r from-red-500 to-red-700 flex flex-row gap-3 justify-center items-center py-4 rounded-sm text-white mt-4 font-bold cursor-pointer hover:shadow-lg'
          onClick={()=>{
          navigate('/posts');
          }}><StickyNote size={25}/>My Posts</div>)}
          {!isSameUser&&(<div className='bg-gradient-to-r from-red-500 to-red-700 flex flex-row gap-3 justify-center items-center py-4 rounded-sm text-white mt-4 font-bold cursor-pointer hover:shadow-lg'
          onClick={()=>{createConversation({
            buyer_id: userId,
            seller_id: data.user_id,
            post_id: data.post_id
          });
          navigate('/conversations');
          }}><MessageCircle size={25} /> Message seller</div>)}
          {!isSameUser&&(<a className='border-[1px] border-red-500 flex flex-row gap-3 justify-center items-center py-4 rounded-sm text-red-500 mt-4 font-bold cursor-pointer hover:bg-red-100 hover:text-red-500' href='#Financing'><Calculator size={25} /> Financing</a>)}
          {!isSameUser&&(<div className='flex flex-row min-w-full gap-2'> 
          <div className='border-[1px] border-red-500 flex flex-row gap-3 justify-center items-center py-4 rounded-sm text-red-500 mt-4 font-bold cursor-pointer hover:bg-red-100 hover:text-red-500 flex-1' onClick={()=>{setIsCarAuditOpen(true)}}><FileCheck2 size={25} />Car audit</div>
          <div className='border-[1px] border-red-500 flex flex-row gap-3 justify-center items-center py-4 rounded-sm text-red-500 mt-4 font-bold cursor-pointer hover:bg-red-100 hover:text-red-500 flex-1' onClick={()=>{setIsCarDeliveryOpen(true)}}><Truck size={25} />Car delivery</div>
          </div>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetailedSection;
