import React from 'react'
import {ChartNoAxesGantt, Calendar, Car, Settings2, Fuel, LifeBuoy, MapPin, Banknote, ChartColumnStacked, Heart, CirclePlus} from 'lucide-react';
import { useNavigate } from 'react-router'
import favcar from '../../assets/favcar.svg'
import addpostsimage from '../../assets/f.svg'
import carmodel from '../../assets/carmodel.jpg'
import { useDeletePostMutation, useGetMyPostsQuery } from '@/redux/slices/apiSlice';

const MyPostsPage = () => {
  const navigate = useNavigate();
  const {data, error, isLoading} = useGetMyPostsQuery();
  const [deletePost, {error: deletePostError}] = useDeletePostMutation();


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

  const handleDeletePost =async(id)=>{
    try{
      await deletePost(id).unwrap();
      alert('Post deleted successfully.');
    }catch(err){
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <div className='container min-w-screen-2xl max-w-screen-2xl min-h-max bg-[var(--background)] mx-auto px-24 py-10'>
      <div className='flex flex-row items-center justify-between px-16'>
        <h1 className='text-3xl font-extrabold text-left'>My posts</h1>
        <button 
          className='bg-gradient-to-r from-red-500 to-red-700 hover:from-red-500 hover:to-red-500 text-white p-1 flex flex-row items-center gap-2 font-bold px-4 py-2' 
          onClick={()=>navigate('/posts/create')}
        >
          <CirclePlus size={20}/>Create new post
        </button>
      </div>
      
      <div className='flex flex-col justify-center items-center'>
        {isLoading && <div>Loading...</div>}
        {error && <div>Error loading posts: {error.message}</div>}
        
        {data?.length === 0 && (
          <div>
            <img src={addpostsimage} alt='favorite cars' className='size-96'/>
            <p>Here you will see your posts with the cars that you are selling.</p>
            <button 
              className='bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg hover:shadow-gray-400 hover:from-red-500 hover:to-red-500 min-w-96 max-w-96 p-3 text-lg font-bold mt-8 hover:border-none focus:outline-none outline-none border-none'
              onClick={()=>navigate('/posts/create')}
            >
              Create a new post
            </button>
          </div>
        )}

        {data?.length > 0 && (
          <div className='flex flex-col gap-5 mt-10'>
            {data.map((car) => {
              console.log(`Car ${car.car_id} images:`, car.image_urls);
              
              return (
                <div 
                  className='rounded-lg min-w-full min-h-56 max-h-56 my-2 bg-white flex flex-row cursor-pointer shadow-sm hover:shadow-md group'
                  key={car.car_id}
                >
                  <div className='max-h-full max-w-72 rounded-l-lg relative flex'>
                    <img 
                      src={getValidImageUrl(car.image_urls)} 
                      className='min-h-full max-h-full max-w-72 rounded-l-lg object-cover'
                      onError={(e) => {
                        console.log('Image load error, falling back to default');
                        e.target.src = carmodel;
                      }}
                      alt={car.title}
                    />
                  </div>
                  
                  <div className='flex flex-col p-4 flex-1'>
                    <h3 className='text-black font-extrabold text-xl text-left group-hover:text-red-500'>
                      {car.title}
                    </h3>

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
                      <button 
                        className='bg-black hover:bg-black/70 rounded-lg text-white font-bold min-w-40' 
                        onClick={(e)=>{
                          e.stopPropagation();
                          navigate(`/posts/edit/${car.car_id}`);
                        }}
                      >
                        Edit
                      </button>

                      <button 
                        className='bg-red-500 hover:bg-red-400 rounded-lg text-white font-bold min-w-40' 
                        onClick={()=>handleDeletePost(car.car_id)}
                      >
                        Delete
                      </button>

                      <div className='flex flex-row items-center'>
                        <p className='text-[1.3rem] font-bold'>{formatEuro(car.price)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPostsPage;