import React from 'react'
import carmodel from '../assets/carmodel.jpg'
import { ChartNoAxesGantt, LifeBuoy, Car, Calendar, Settings2, Fuel, MapPin, Euro, Banknote,ChartColumnStacked,Heart } from 'lucide-react'
import { useSearchCarsQuery } from '@/redux/slices/apiSlice'
import { useNavigate, useSearchParams } from 'react-router'
import { useEffect } from 'react'

const formatEuro = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

const CarsResults = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {data, error, isLoading} = useSearchCarsQuery({
        country: searchParams.get('country'),
        state: searchParams.get('state'),
        brand: searchParams.get('brand'),
        model: searchParams.get('model'),
        price_from: searchParams.get('price_from')?.replace('.', ''),
        price_to: searchParams.get('price_to')?.replace('.', ''),
        year_from: searchParams.get('year_from'),
        year_to: searchParams.get('year_to'),
        mileage: searchParams.get('mileage'),
        fuel: searchParams.get('fuel'),
        traction: searchParams.get('traction'),
        engine_size_from: searchParams.get('engine_size_from'),
        engine_size_to: searchParams.get('engine_size_to'),
        engine_power_from: searchParams.get('engine_power_from'),
        engine_power_to: searchParams.get('engine_power_to'),
        transmission: searchParams.get('transmission'),
        color: searchParams.get('color'),
        interior_color: searchParams.get('interior_color'),
        body: searchParams.get('body'),
    });

    useEffect(() => {
        console.log('Search params:', {
          country: searchParams.get('country'),
          state: searchParams.get('state'),
          brand: searchParams.get('brand'),
          model: searchParams.get('model'),
          price_from: searchParams.get('price_from'),
          price_to: searchParams.get('price_to')
        });
      }, [searchParams]);

    console.log(data);

    if(isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if(error) {return <div className="flex flex-col gap-3 justify-center items-center min-h-screen text-red-500">
    <p className='text-lg font-bold'>WE ARE SORRY:((</p>
    <p className='text-sm text-black'>None of our cars matches your search parameters.</p>
    <p className='text-red-500 underline font-bold hover:no-underline cursor-pointer'
    onClick={()=>navigate('/cars')}>Cancel filters</p>
    </div>};
    if (!data || data.length === 0) {
        return <div className="flex justify-center items-center min-h-screen">
            No cars found matching your criteria
        </div>;
    }

 
  return (
    <div className='flex flex-col min-w-full min-h-max'>
      {data.map((car)=>{
        return(
            <div className='rounded-lg min-w-full min-h-56 max-h-56 my-2 bg-white flex flex-row cursor-pointer shadow-sm hover:shadow-md group'>
                <div className='max-h-full max-w-72 rounded-l-lg relative flex'>
                <img src={carmodel} className='min-h-full max-h-full max-w-72 rounded-l-lg object-cover'/>
                <Heart size={25} fill='rgba(239, 68, 68,0.5)' className='text-white m-2 absolute top-2 right-2 hover:size-7'
                onClick={(e)=>{
                    e.stopPropagation();
                }}/>
                </div>
                <div className='flex flex-col p-4 flex-1'>
                    <h3 className='text-black font-extrabold text-xl text-left group-hover:text-red-500'>{car.title}</h3>

                    <div className='flex flex-row mt-6 gap-5 items-center'>

                        <div className='flex flex-row items-center'>
                            <ChartNoAxesGantt className='size-4'/>
                            <p className='text-xs font-bold '>{car.mileage} km</p>
                        </div>

                        <div className='flex flex-row items-center'>
                            <Calendar className='size-4'/>
                            <p className='text-xs font-bold'>{car.year}</p>
                        </div>

                        <div className='flex flex-row items-center'>
                            <Car className='size-4'/>
                            <p className='text-xs font-bold'>{car.engine_power} hp</p>
                        </div>

                        <div className='flex flex-row items-center'>
                            <Settings2 className='size-4'/>
                            <p className='text-xs font-bold'>{car.transmission}</p>
                        </div>

                        <div className='flex flex-row items-center'>
                            <Fuel className='size-4'/>
                            <p className='text-xs font-bold'>{car.fuel}</p>
                        </div>

                        <div className='flex flex-row items-center'>
                            <LifeBuoy className='size-4'/>
                            <p className='text-xs font-bold'>{car.traction}</p>
                        </div>

                    </div>

                    <div className='flex flex-row items-center mt-20 justify-between min-w-full max-w-full'>

                        <div className='flex flex-row items-center gap-2'>
                            <MapPin />
                            <div className='flex flex-col justify-center content-center items-start'>
                            <p className='text-xs font-semibold'>Location:</p>
                            <p className='text-sm font-bold'>{car.country},{car.state}</p>
                            </div>
                        </div>

                        <div className='flex flex-row items-center gap-2'>
                            <Banknote />
                            <div className='flex flex-col justify-center content-center items-start'>
                            <p className='text-xs font-semibold'>Monthly Payment:</p>
                            <p className='text-sm font-bold'>{formatEuro(Math.round(car.price /60))}</p>
                            </div>
                        </div>

                        <div className='flex flex-row items-center gap-2'>
                            <ChartColumnStacked />
                            <div className='flex flex-col justify-center content-center items-start'>
                            <p className='text-xs font-semibold text-left'>Price Comparison:</p>
                            <p className='text-sm font-bold text-left'>{car.location}</p>
                            </div>
                        </div>

                        <div className='flex flex-row items-center'>
                            <p className='text-[1.3rem] font-bold'>{formatEuro(car.price)}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
      })}

    </div>
  )
}

export default CarsResults
