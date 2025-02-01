import React, {useState, useRef, useEffect} from 'react'
import PriceMap from './PriceMap';
import Notes from './Notes';
import Details from './Details';
import Financing from './Financing';
import { Calculator, Truck, FileCheck2, MessageCircle, X,StickyNote, Car, CircleAlert, Wrench } from 'lucide-react';
import CarAuditForm from './CarAuditForm';
import CarDeliveryForm from './CarDeliveryForm';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button';
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { useCreateCarReportMutation, useCreateConversationMutation, useEvaluatePriceMutation } from '@/redux/slices/apiSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Keyframes from './Keyframes';

const CarDetailedSection = ({data}) => {

  const [isCarAuditOpen, setIsCarAuditOpen] = useState(false);
  const [isCarDeliveryOpen, setIsCarDeliveryOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [carOverview, setCarOverview] =  useState('');
  const [knownIssues, setKnownIssues] =  useState('');
  const [maintenanceTips, setMaintenanceTips] =  useState('');
  const [createConversation] = useCreateConversationMutation();
  const calendarRef = useRef();
  const userId = useSelector(state=>state.user.userData.id);
  const navigate = useNavigate();
  console.log("DATA",data);
  const [evaluatePrice, { data:evaluatePriceData, error, isLoading }] = useEvaluatePriceMutation();
  const [createCarReport] = useCreateCarReportMutation();
  const [priceComparisons, setPriceComparisons] = useState([]);
  
  const carDetails = data ? {
    brand: data.brand,
    model: data.model,
    year: data.year,
    engine_size: data.engine_size,
    engine_power: data.engine_power,
    fuel: data.fuel,
    traction: data.traction,
    transmission: data.transmission,
    mileage: data.mileage,
    body: data.body,
  } : null;

  useEffect(() => {
    const fetchPriceEvaluation = async () => {
      if (!carDetails) {
        console.log('Car details not yet available');
        return;
      }

      try {
        const requiredFields = ['brand', 'model', 'year', 'fuel'];
        const missingFields = requiredFields.filter(field => !carDetails[field]);
        
        if (missingFields.length > 0) {
          console.error('Missing required fields:', missingFields);
          return;
        }

        const result = await evaluatePrice(carDetails).unwrap();
        setPriceComparisons(result);
      } catch (err) {
        console.error('Failed to evaluate price:', err);
      }
    };

    fetchPriceEvaluation();
  }, [data, evaluatePrice]);

  const handleAiCarReport = async()=>{
    if(carOverview===''||knownIssues===''||maintenanceTips===''){try {
      const requiredFields = ['brand', 'model', 'year', 'fuel'];
      const missingFields = requiredFields.filter(field => !carDetails[field]);
      
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        return;
      }

      const result = await createCarReport(carDetails).unwrap();
      setCarOverview(result.car_overview);
      setKnownIssues(result.known_issues);
      setMaintenanceTips(result.maintenance_tips);
      console.log('Car report details:', result);
    } catch (err) {
      console.error('Failed to generate car report:', err);
    }}
  };


const formatEuro = (amount) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

const isLoadingForm = isAiOpen!=false &&(carOverview === '' || knownIssues === '' || maintenanceTips ==='');

const isSameUser= data?.user_id ===userId? true: false;

  return (
    <div className='flex flex-row mt-8 min-h-max'>

      {isCarAuditOpen&&(<CarAuditForm calendarRef={calendarRef} setIsCarAuditOpen={setIsCarAuditOpen}/>)}

      {isCarDeliveryOpen&&(<CarDeliveryForm calendarRef={calendarRef} setIsCarDeliveryOpen={setIsCarDeliveryOpen}/>)}
      
      <div className='flex flex-col flex-1 h-[100rem] px-9 min-h-max'>
        <Details data={data}></Details>
        {data?.notes&&(<Notes data={data}></Notes>)}
        <PriceMap data={data} prices={priceComparisons}
        ></PriceMap>
        <Financing data={data}></Financing>
      </div>
      <div className='w-96 h-max sticky top-24'>
        <div className='bg-white h-max rounded-lg flex flex-col relative'>
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
          <Drawer >
            <DrawerTrigger><button className='relative 
            px-6 py-3
            bottom-[-180px]
            border-none
            font-semibold 
            rounded-lg
            bg-white
            text-gray-800
            transition-all duration-300 ease-in-out
            before:absolute
            before:inset-0
            before:-z-10
            before:rounded-lg
            before:bg-red-500
            before:blur-xl
            before:opacity-100
            before:transition-all
            before:duration-300
            hover:before:blur-2xl
            hover:before:opacity-75
            cursor-pointer
          ' onClick={(e)=>{setIsAiOpen(true), handleAiCarReport()}}>AI-Powered Car Insights</button></DrawerTrigger>
            <DrawerContent className="bg-white">
              <DrawerHeader className='flex flex-row items-start justify-around'>
                <div className='flex flex-col min-w-96 max-w-96 text-center'>
                <Car  size={80} className='text-red-500 mx-auto mb-6'/>
                <DrawerTitle>Car Overview</DrawerTitle>
                <DrawerDescription>{typeof carOverview === 'string' ? carOverview : JSON.stringify(carOverview)}</DrawerDescription>
                </div>
                <div className='flex flex-col min-w-96 max-w-96 text-center'>
                <CircleAlert size={80} className='text-red-500 mx-auto mb-6'/>
                <DrawerTitle>Known Issues</DrawerTitle>
                <DrawerDescription>{typeof knownIssues === 'string' ? knownIssues : JSON.stringify(knownIssues)}</DrawerDescription>
                </div>
                <div className='flex flex-col min-w-96 max-w-96 text-center'>
                <Wrench size={80} className='text-red-500 mx-auto mb-6'/>
                <DrawerTitle>Maintenance Tips</DrawerTitle>
                <DrawerDescription>{typeof maintenanceTips === 'string' ? maintenanceTips : JSON.stringify(maintenanceTips)}</DrawerDescription>
                </div>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose>
                  <Button variant="outline">Done</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      {isLoadingForm&&(<div className='fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center'>
            <Keyframes/>
      </div>)}
    </div>
  )
}

export default CarDetailedSection;
