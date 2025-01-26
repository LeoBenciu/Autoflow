import FilterTabs from '@/schadcn/FilterTabs'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight, CirclePlus, X, CircleCheck, Check } from 'lucide-react'
import { HeroSelector } from '@/schadcn/HeroSelector'
import ColorsTooltip from '@/schadcn/ColorsTooltip'
import { bodies, carModels, engine_powers, engine_sizes, fuels, mileages, prices, tractions, years,countries,states } from '@/app/Lists'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useNavigate, useSearchParams } from 'react-router'
import { carBrands } from '@/app/Lists'



const SidebarFilters = () => {

  const navigate=useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [brandSelected, setBrandSelected] = useState();
  const [colorsSelected, setColorsSelected] = useState([]);
  const [interiorColorsSelected, setInteriorColorsSelected] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [allModelsSelected, setAllModelsSelected] = useState(false);



  const updateFilters = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    setSearchParams(params);
  };


  const handleAllModels = () => {
   if (allModelsSelected) {
     setSelectedModels([]);
     setAllModelsSelected(false);
   } else {
     setSelectedModels(carModels[brandSelected]);
     setAllModelsSelected(true);
   }
  };

  const handleColors = (color) =>{
    const newColorsList = colorsSelected.includes(color)
    ? colorsSelected.filter(c => c !== color)
    : [...colorsSelected, color];
    
    setColorsSelected(newColorsList);
    
    if (newColorsList.length === 0) {
      updateFilters('color', null);
    } else {
      updateFilters('color', newColorsList.join(','));
    }
    };

  const handleInteriorColors = (color) =>{
    const newColorsList = interiorColorsSelected.includes(color)
    ? interiorColorsSelected.filter(c => c !== color)
    : [...interiorColorsSelected, color];

    setInteriorColorsSelected(newColorsList);
    
    if (newColorsList.length === 0) {
      updateFilters('interior_color', null);
    } else {
      updateFilters('interior_color', newColorsList.join(','));
    }
    };

  const handleButtonSelectModels = ()=>{
      const selectedModelsString = selectedModels.join(',');

      updateFilters('model', selectedModelsString);

      setIsPopupVisible(false);
    };

  return (
    <div className='flex flex-col min-h-max max-h-max
     bg-white min-w-[25%] max-w-[25%] px-3 py-5 rounded-xl'>
        <div className='flex flex-row justify-between pr-2 items-center'>
          <h3 className='text-left font-bold text-xl'>Filters</h3>
          <button className='hover:text-red-500 text-base font-semibold' onClick={()=>navigate('/cars')}>Cancel filters</button>
        </div>
        <h4 className='mt-4 text-left font-bold text-red-500'>LOCATION</h4>
        <div className='flex flex-row gap-2 mt-2'>
          <HeroSelector placeholder='Country' listValues={countries} onValueChange={(value)=>{updateFilters('country',value); if(searchParams.get('state')) updateFilters('state', '')}} 
          value={searchParams.get('country')|| ''}/>
          <HeroSelector placeholder='State' listValues={states[searchParams.get('country')]} disabled={searchParams.get('country')?false:true}
          onValueChange={(value)=>updateFilters('state',value)} value={searchParams.get('state')|| ''}/>
        </div>
        <h4 className='mt-6 text-left font-bold'>MAKE AND MODEL</h4>
        <Button className="text-black border-gray-300 mt-2 shadow-sm"
        onClick={()=>setIsPopupVisible(true)}><CirclePlus/>Add a car</Button>
        {isPopupVisible&&(
        <div className='fixed inset-0 z-40 flex items-center justify-center bg-black/30'
        onClick={()=>{setIsPopupVisible(false); setBrandSelected();}}>
          <div className='rounded-lg bg-white min-w-96 max-w-96 min-h-[30rem] p-5 relative'
          onClick={(e)=>{e.preventDefault();
            e.stopPropagation()
          }}>
            {!brandSelected && (
          <h2 className='text-black font-bold text-2xl mb-3'>Select Make</h2>
            )}
            {brandSelected && (
              <div className='flex flex-row items-center justify-between mb-3'>
              <ChevronLeft onClick={()=>setBrandSelected()}
                className='cursor-pointer'></ChevronLeft>
              <h2 className='text-black font-bold text-2xl'>Select Model</h2>
              <ChevronLeft className='text-transparent'></ChevronLeft>
              </div>
            )}
          <Command className='focus:outline-none'>
            <CommandInput placeholder="Type a command or search..."/>
            <CommandList className='min-h-[30rem]'>
              <CommandEmpty>No results found.</CommandEmpty>
              {!brandSelected && (
               <CommandGroup heading="ALL BRANDS" className='text-left mb-12'>
                 {carBrands.map((brand) => (
                   <CommandItem key={brand.name}>
                     <div className='flex flex-row items-center gap-3 hover:bg-red-50 rounded-lg
                       min-w-full px-2 py-1 justify-between group cursor-pointer'
                       onClick={() => {
                        setBrandSelected(brand.name);
                        updateFilters('brand', brand.name);
                      }}>
                       <div className='flex flex-row items-center gap-5'>
                         <img src={brand.icon} className='size-8 object-cover'/>
                         {brand.name}
                       </div>
                       <ChevronRight size={20} className='group-hover:block hidden'/>
                     </div>
                   </CommandItem>
                 ))}
               </CommandGroup>
              )}
                {brandSelected && (
                 <CommandGroup heading={brandSelected.toUpperCase()} className='text-left mb-12'>
                    <CommandItem>
                     <div className='flex flex-row items-center gap-3 hover:bg-red-50 rounded-lg
                      min-w-full px-2 py-2 group cursor-pointer' 
                      onClick={handleAllModels}>
                       {allModelsSelected && <CircleCheck size={30} className='text-green-500'/>}
                       All Models
                     </div>
                    </CommandItem>
                   {carModels[brandSelected].map((model) => (
                     <CommandItem key={model}>
                       <div className='flex flex-row items-center gap-3 hover:bg-red-50 rounded-lg
                        min-w-full px-2 py-2 group cursor-pointer' 
                        onClick={() => {
                          if(selectedModels.includes(model)) {
                            setSelectedModels(selectedModels.filter(m => m !== model));
                          } else {
                            setSelectedModels([...selectedModels, model]);
                          }
                        }}>
                         {selectedModels.includes(model) && <CircleCheck size={30} className='text-green-500'/>}
                         {model}
                       </div>
                     </CommandItem>
                   ))}
                 </CommandGroup>
                )}
                <button className='bg-gradient-to-r from-red-500 to-red-700 hover:from-red-500
              hover:to-red-500 text-white p-2 w-[90%] absolute bottom-4 left-[5%] right-[5%] font-bold' onClick={handleButtonSelectModels}>
               Select
              </button>
            </CommandList>
          </Command>
          <button className='absolute top-[-23px] right-[-23px] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-500
          hover:to-red-500 text-white
          w-12 h-12 flex items-center justify-center'
          onClick={()=>{setIsPopupVisible(false); setBrandSelected();}}><X size={20}></X></button>
          </div>
        </div>
        )}
        <h4 className='mt-4 text-left font-bold'>PRICE(€)</h4>
        <div className='flex flex-row gap-2 mt-2'>
          <HeroSelector placeholder='From' listValues={prices} onValueChange={(value) => updateFilters('price_from', value)} 
          value={searchParams.get('price_from')|| ''}/>
          <HeroSelector placeholder='To' listValues={prices} onValueChange={(value) => updateFilters('price_to', value)} 
          value={searchParams.get('price_to')|| ''}/>
        </div>
        <h4 className='mt-4 text-left font-bold'>REGISTRATION</h4>
        <div className='flex flex-row gap-2 mt-2'>
          <HeroSelector placeholder='From' listValues={years} onValueChange={(value) => updateFilters('year_from', value)} 
          value={searchParams.get('year_from')|| ''}/>
          <HeroSelector placeholder='To' listValues={years} onValueChange={(value) => updateFilters('year_to', value)} 
          value={searchParams.get('year_to')|| ''}/>
        </div>
        <h4 className='mt-4 text-left font-bold'>MILEAGE</h4>
        <div className='flex flex-row gap-2 mt-2'>
          <HeroSelector placeholder='From' listValues={mileages} onValueChange={(value) => updateFilters('mileage_from', value)} 
          value={searchParams.get('mileage_from')|| ''}/>
          <HeroSelector placeholder='To' listValues={mileages} onValueChange={(value) => updateFilters('mileage_to', value)} 
          value={searchParams.get('mileage_to')|| ''}/>
        </div>
        <h4 className='mt-4 text-left font-bold'>TRANSMISSION</h4>
        <div className='flex flex-row gap-2 mt-2'>
          <Button className={`min-w-[49%] text-black border-gray-200 shadow-sm ${searchParams.get('transmission') === 'Automatic' ? 'bg-red-500 text-white border-red-500 hover:bg-red-500': ''}`} 
          onClick={()=>updateFilters('transmission','Automatic')}>Automatic</Button>
          <Button className={`min-w-[49%] text-black border-gray-200 shadow-sm ${searchParams.get('transmission') === 'Manual' ? 'bg-red-500 text-white border-red-500 hover:bg-red-500': ''}`} 
          onClick={()=>updateFilters('transmission','Manual')}>Manual</Button>
        </div>
        <h4 className='mt-4 text-left font-bold'>FUEL</h4>
        <div className='flex flex-row mt-2'>
          <HeroSelector className="min-w-full" placeholder='All' listValues={fuels} 
          onValueChange={(value) => updateFilters('fuel', value)} value={searchParams.get('fuel')|| ''}/>
        </div>
        <h4 className='mt-4 text-left font-bold'>ENGINE SIZE</h4>
        <div className='flex flex-row gap-2 mt-2'>
          <HeroSelector placeholder='From' listValues={engine_sizes} onValueChange={(value) => updateFilters('engine_size_from', value)} 
          value={searchParams.get('engine_size_from')|| ''}/>
          <HeroSelector placeholder='To' listValues={engine_sizes} onValueChange={(value) => updateFilters('engine_size_to', value)} 
          value={searchParams.get('engine_size_to')|| ''}/>
        </div>
        <h4 className='mt-4 text-left font-bold'>POWER</h4>
        <div className='flex flex-row gap-2 mt-2'>
          <HeroSelector placeholder='From' listValues={engine_powers} onValueChange={(value) => updateFilters('engine_power_from', value)}
          value={searchParams.get('engine_power_from')|| ''}/>
          <HeroSelector placeholder='To' listValues={engine_powers} onValueChange={(value) => updateFilters('engine_power_to', value)} 
          value={searchParams.get('engine_power_to')|| ''}/>
        </div>
        <h4 className='mt-4 mb-2 text-left font-bold'>TRACTION</h4>
        <HeroSelector className="min-w-full" placeholder="All" listValues={tractions} onValueChange={(value) => updateFilters('traction', value)} 
        value={searchParams.get('traction')|| ''}/>
        <h4 className='mt-4 mb-2 text-left font-bold'>VEHICLE TYPE</h4>
        <HeroSelector className="min-w-full" placeholder="All" listValues={bodies} onValueChange={(value) => updateFilters('body', value)} 
        value={searchParams.get('body')|| ''}/>
        <h4 className='mt-4 text-left font-bold'>EXTERIOR COLOR</h4>
        <div className='flex flex-row justify-around mt-3'>
        <Button className={`rounded-full size-7 bg-white hover:bg-gray-100 p-0 text-black`}
        onClick={()=>handleColors('white')}>{searchParams.get('color')?.split(',').includes('white')? <Check size={10}/>:''}</Button>
        <Button className="rounded-full size-7 bg-black hover:bg-black/70 p-0"
        onClick={()=>handleColors('black')}>{searchParams.get('color')?.split(',').includes('black')? <Check size={10}/>:''}</Button>
        <Button className="rounded-full size-7 bg-gray-400 hover:bg-gray-300 p-0"
        onClick={()=>handleColors('gray')}>{searchParams.get('color')?.split(',').includes('gray')? <Check size={10}/>:''}</Button>
        <Button className="rounded-full size-7 bg-red-500 hover:bg-red-400 p-0"
        onClick={()=>handleColors('red')}>{searchParams.get('color')?.split(',').includes('red')? <Check size={10}/>:''}</Button>
        <Button className="rounded-full size-7 bg-blue-500 hover:bg-blue-400 p-0"
        onClick={()=>handleColors('blue')}>{searchParams.get('color')?.split(',').includes('blue')? <Check size={10}/>:''}</Button>
        <Button className="rounded-full size-7 bg-green-500 hover:bg-green-400 p-0"
        onClick={()=>handleColors('green')}>{searchParams.get('color')?.split(',').includes('green')? <Check size={10}/>:''}</Button>
        </div>
        <div className='flex flex-row min-w-full justify-around mt-3'>
        <Button className="rounded-full size-7 bg-yellow-400 hover:bg-yellow-300 p-0"
        onClick={()=>handleColors('yellow')}>{searchParams.get('color')?.split(',').includes('yellow')? <Check size={10}/>:''}</Button>
        <Button className="rounded-full size-7 bg-orange-500 hover:bg-orange-400 p-0"
        onClick={()=>handleColors('orange')}>{searchParams.get('color')?.split(',').includes('orange')? <Check size={10}/>:''}</Button>
        <Button className="rounded-full size-7 bg-purple-500 hover:bg-purple-400 p-0"
        onClick={()=>handleColors('purple')}>{searchParams.get('color')?.split(',').includes('purple')? <Check size={10}/>:''}</Button>
        <Button className="rounded-full size-7 bg-orange-900 hover:bg-orange-800 p-0"
        onClick={()=>handleColors('brown')}>{searchParams.get('color')?.split(',').includes('brown')? <Check size={10}/>:''}</Button>
        <Button className="rounded-full size-7  p-0 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 hover:from-gray-100 hover:via-gray-300 hover:to-gray-100
        text-black"
        onClick={()=>handleColors('silver')}>{searchParams.get('color')?.split(',').includes('silver')? <Check size={10}/>:''}</Button>
        <Button className="rounded-full size-7 bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-600 hover:from-yellow-300 hover:via-yellow-600 hover:to-yellow-300 p-0
        text-black"
        onClick={()=>handleColors('gold')}>{searchParams.get('color')?.split(',').includes('gold')? <Check size={10}/>:''}</Button>
        </div>
        <div className='flex flex-row min-w-full justify-around mt-3'>
        <Button className="rounded-full size-7 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 p-0 hover:from-blue-500 hover:via-yellow-500 hover:to-red-500"
        onClick={()=>handleColors('other')}>{searchParams.get('color')?.split(',').includes('other')? <Check size={10}/>:''}</Button>
        </div>
        <h4 className='mt-4 text-left font-bold'>INTERIOR COLOR</h4>
        <div className='flex flex-row justify-around mt-3'>
        <Button className={`rounded-full size-7 bg-white hover:bg-gray-100 p-0 text-black`}
        onClick={()=>handleInteriorColors('white')}>{searchParams.get('interior_color')?.split(',').includes('white')? <Check size={10}/>:''}</Button>
        <Button className={`rounded-full size-7 bg-black hover:bg-black/70 p-0`}
        onClick={()=>handleInteriorColors('black')}>{searchParams.get('interior_color')?.split(',').includes('black')? <Check size={10}/>:''}</Button>
        <Button className={`rounded-full size-7 bg-gray-400 hover:bg-gray-300 p-0`}
        onClick={()=>handleInteriorColors('gray')}>{searchParams.get('interior_color')?.split(',').includes('gray')? <Check size={10}/>:''}</Button>
        <Button className={`rounded-full size-7 bg-orange-900 hover:bg-orange-800 p-0`}
        onClick={()=>handleInteriorColors('brown')}>{searchParams.get('interior_color')?.split(',').includes('brown')? <Check size={10}/>:''}</Button>
        <Button className={`rounded-full size-7 bg-blue-900 hover:bg-blue-800 p-0`}
        onClick={()=>handleInteriorColors('blue')}>{searchParams.get('interior_color')?.split(',').includes('blue')? <Check size={10}/>:''}</Button>
        <Button className={`rounded-full size-7 bg-red-600 p-0 hover:bg-red-500`}
        onClick={()=>handleInteriorColors('red')}>{searchParams.get('interior_color')?.split(',').includes('red')? <Check size={10}/>:''}</Button>
        <Button className={`rounded-full size-7 bg-stone-200 p-0 hover:bg-stone-100 text-black`}
        onClick={()=>handleInteriorColors('beige')}>{searchParams.get('interior_color')?.split(',').includes('beige')? <Check size={10}/>:''}</Button>
        <Button className={`rounded-full size-7 bg-amber-600 p-0 hover:bg-amber-500 `}
        onClick={()=>handleInteriorColors('orange')}>{searchParams.get('interior_color')?.split(',').includes('orange')? <Check size={10}/>:''}</Button>
        </div>
    </div>
  )
}

export default SidebarFilters
