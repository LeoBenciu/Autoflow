import React from 'react'
import favcar from '../../assets/favcar.svg'
import { useNavigate } from 'react-router'
import { Truck,Wallet,ClipboardCheck,ChartNoAxesGantt,Calendar,Car,Settings2,Fuel,LifeBuoy,MapPin,Banknote,ChartColumnStacked, Heart  } from 'lucide-react';
import carmodel from '../../assets/carmodel.jpg'
import UniqueFeatures from '@/components/3USP';
import { useGetSavedPostsQuery } from '@/redux/slices/apiSlice';
import { setSavedPosts } from '@/redux/slices/postsSlice';
import { useSavePostMutation } from '@/redux/slices/apiSlice';
import { useSelector } from 'react-redux';

const FavoritesPage = () => {

    const navigate = useNavigate();
        const { data: savedPostsData,
            error: savedPostsError,
            isLoading: savedPostsIsLoading } = useGetSavedPostsQuery();
    const [savePost] = useSavePostMutation();
    const savedPosts = useSelector(state=> state.post.savedPosts);
    console.log(savedPostsData)

    const formatEuro = (amount) => {
        return new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(amount);
      };

    const getValidImageUrl = (imageUrls) => {
        if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
          console.log('No valid image URLs found, using default');
          return carmodel;
        }
        
        console.log('Using image URL:', imageUrls[0]);
        
        if (!imageUrls[0].startsWith('http')) {
          return `${window.location.origin}${imageUrls[0]}`;
        }
        
        return imageUrls[0];
      };

  return (
    <div className=' container min-w-screen-2xl max-w-screen-2xl min-h-max bg-[var(--background)] mx-auto px-24 py-10'>
    <h1 className='text-3xl font-extrabold text-left'>Favorite cars</h1>
    <div className='flex flex-col justify-center items-center'>
       {savedPostsData?.length<1&&(<div><img src={favcar} alt='favorite cars' className='size-96'></img>
        <p>You add a car to favourites by clicking on a heart icon.</p>
        <button className='bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg hover:shadow-gray-400 hover:from-red-500 
        hover:to-red-500 min-w-96 max-w-96 p-3 text-lg font-bold mt-8 hover:border-none focus:outline-none outline-none border-none' 
        onClick={()=>navigate('/cars')}
        >Search cars</button>
        </div>)}
        {savedPostsData?.length>0&&(<div className='flex flex-col gap-5'>
        {savedPostsData?.map((car)=>{
            const isSaved= savedPostsData.some(saved=> saved.post_id === car.post_id)
        return(
            <div className='rounded-lg min-w-full min-h-56 max-h-56 my-2 bg-white flex flex-row cursor-pointer shadow-sm hover:shadow-md group'>
                <div className='max-h-full max-w-72 rounded-l-lg relative flex'>
                <img className='min-h-full max-h-full max-w-72 rounded-l-lg object-cover'
                src={getValidImageUrl(car.image_urls)} 
                onError={(e) => {
                  console.log('Image load error, falling back to default');
                  e.target.src = carmodel;
                }}
                alt={car.title}/>
                <Heart size={25} fill={isSaved ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 0.2)'} className='text-white m-2 absolute top-2 right-2 hover:size-7 '
                                onClick={async(e)=>{
                                    e.preventDefault();
                                    try{
                                        const saved = await savePost(car.post_id).unwrap();
                                        console.log('Car saved successfully');
                                    }catch(err){
                                        console.error('Failed to save post:', err);
                                    }
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
        </div>)}
        <UniqueFeatures/>
    </div>
    </div>
  )
}

export default FavoritesPage
