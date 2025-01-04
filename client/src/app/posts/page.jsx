import React from 'react'
import {ChartNoAxesGantt,Calendar,Car,Settings2,Fuel,LifeBuoy,MapPin,Banknote,ChartColumnStacked, Heart  } from 'lucide-react';
import { useNavigate } from 'react-router'
import favcar from '../../assets/favcar.svg'
import addpostsimage from '../../assets/f.svg'

const posts=[];

const MyPostsPage = () => {

  const navigate = useNavigate();

  const formatEuro = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  return (
    <div className=' container min-w-screen-2xl max-w-screen-2xl min-h-max bg-[var(--background)] mx-auto px-24 py-10'>
    <h1 className='text-3xl font-extrabold text-left'>My posts</h1>
    <div className='flex flex-col justify-center items-center'>
    {posts.length<1&&(<div><img src={addpostsimage} alt='favorite cars' className='size-96'></img>
            <p>Here you will see your posts with the cars that you are selling.</p>
            <button className='bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg hover:shadow-gray-400 hover:from-red-500 
            hover:to-red-500 min-w-96 max-w-96 p-3 text-lg font-bold mt-8 hover:border-none focus:outline-none outline-none border-none' 
            onClick={()=>navigate('/posts/create')}
            >Create a new post</button>
            </div>)}
    {posts.length>0&&(<div className='flex flex-col gap-5'>
        {posts.map((car)=>{
        return(
            <div className='rounded-lg min-w-full min-h-56 max-h-56 my-2 bg-white flex flex-row cursor-pointer shadow-sm hover:shadow-md group'>
                <div className='max-h-full max-w-72 rounded-l-lg relative flex'>
                <img src={car.image} className='min-h-full max-h-full max-w-72 rounded-l-lg object-cover'/>
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
                            <p className='text-sm font-bold'>{car.location}</p>
                            </div>
                        </div>

                        <div className='flex flex-row items-center gap-2'>
                            <Banknote />
                            <div className='flex flex-col justify-center content-center items-start'>
                            <p className='text-xs font-semibold'>Monthly Payment:</p>
                            <p className='text-sm font-bold'>{car.location}</p>
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
        </div>)}
        </div>
    </div>
  )
}

export default MyPostsPage
