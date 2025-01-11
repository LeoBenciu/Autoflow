import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import bmw from '../assets/bmw.png'
import HeroTabs from '@/schadcn/HeroTabs';
import { HeroSelector } from '@/schadcn/HeroSelector';
import { HeroCarousel } from '@/schadcn/HeroCarousel';
import { carBrands, carModels, prices, states, countries } from '@/app/Lists';
import { useDispatch, useSelector } from 'react-redux';
import { setResults, setSearchParameters } from '@/redux/slices/searchSlice';
import { useSearchCarsQuery } from '@/redux/slices/apiSlice';
import { useNavigate } from 'react-router';

const HeroSection = () => {

  const [country, setCountry] = useState();
  const [brand,setBrand] = useState();
  const [model, setModel] = useState();
  const [state, setState] = useState();
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();

  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useState(null);
  const {data, error, isLoading} = useSearchCarsQuery(searchParams);
  const navigate = useNavigate();


  useEffect(()=>{
    if (isLoading) console.log('isLoading');
    if(error) console.log(error);
    if(data) {
      console.log('✅ Search params:', searchParams);
      console.log('📊 Cars found:', data);
    };
  },[isLoading,error,data,searchParams])

  const handleSearchButton = async() => {
    const params = new URLSearchParams();

    if (country) params.append('country', country);
    if (state) params.append('state', state);
    if (brand) params.append('brand', brand);
    if (model) params.append('model', model);
    if (minPrice) params.append('price_from', minPrice);
    if (maxPrice) params.append('price_to', maxPrice);

    navigate(`/cars?${params.toString()}`);
  };

  const handleCategoriesButtons = (category) =>{
    if(category==='Family Car'){
      navigate(`/cars?body=Van`);
    }
    else if(category==='City'){
      navigate(`/cars?body=Compact`);
    }
    else if(category==='Luxury'){
      navigate(`/cars?body=Sedan`);
    }
    else if(category==='Sport'){
      navigate(`/cars?body=Other`);
    }
    else if(category==='Suv'){
      navigate(`/cars?body=SUV/Off-road`);
    }else{
    navigate(`/cars?body=${category}`);}
  };

  return (
    <div className=' h-max flex flex-row'>

      <div className='flex flex-col min-h-full flex-1 px-3 pt-28 mx-auto'>
        <h1 className='text-5xl font-extrabold'>Your trusted partner in finding the <span className='text-red-500'>perfect vehicle</span></h1>
        <p className='mt-10'>Drive Your Dreams</p>
        <div className='bg-white min-w-[30rem] max-w-[30rem] min-h-max rounded-xl mt-10 mx-auto p-6'>
            <HeroTabs></HeroTabs>
            <h3 className='text-xl font-bold text-left ml-2 mt-6'>Location details</h3>
            <div className='flex flex-row mt-3 gap-3'>
                <HeroSelector placeholder="Country" listValues={countries} onValueChange={(value)=>setCountry(value)} 
                value={country}/>
                <HeroSelector placeholder="State" listValues={country? states[country] : []}
                onValueChange={(value)=>setState(value)} value={state}
                disabled={country? false : true}/>  
            </div>
            <h3 className='text-xl font-bold text-left mt-6 ml-2'>Car details</h3>
            <div className='flex flex-row mt-3 gap-3'>
                <HeroSelector placeholder="Brand" listValues={carBrands} onValueChange={(value)=>setBrand(value)} 
                value={brand} one={true}/>
                <HeroSelector placeholder="Model" listValues={brand? carModels[brand]:[]} disabled={brand? false: true}
                onValueChange={(value)=>setModel(value)} value={model}/>  
            </div>
            <div className='flex flex-row mt-7 gap-3'>
                <HeroSelector placeholder="Min price Euro(€)" listValues={prices} 
                onValueChange={(value)=>setMinPrice(value)} value={minPrice}/>
                <HeroSelector placeholder="Max price Euro(€)" listValues={prices} 
                onValueChange={(value)=>setMaxPrice(value)} value={maxPrice}/>                  
            </div>
            <Button className="bg-gradient-to-r min-h-12 max-h-12
             from-red-500 to-red-600 hover:from-black hover:to-black font-bold text-white min-w-full hover:border-transparent mt-7"
             onClick={handleSearchButton}>Search Results</Button>
        </div>
      </div>

      <div className='flex flex-col  min-h-full flex-1 px-3'>
        <img src={bmw} className='w-full h-full object-contain'/>
        <HeroCarousel handleCategoriesButtons={handleCategoriesButtons}/>
      </div>

    </div>
  )
}

export default HeroSection;
