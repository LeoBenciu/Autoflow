import { ChevronLeft, Heart, Share, ChartNoAxesGantt, Calendar, Car, Settings2, Fuel, LifeBuoy } from 'lucide-react';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useSavePostMutation, useGetSavedPostsQuery } from '@/redux/slices/apiSlice';

const CarHeader = ({data}) => {

    const navigate = useNavigate();
    const [savePost] = useSavePostMutation();
    const { data: savedPostsData,
        error: savedPostsError,
        isLoading: savedPostsIsLoading } = useGetSavedPostsQuery();

    useEffect(()=>{
        window.scrollTo({
            top:0
        })
    },[]);

    const handleShare = async () => {
        const shareData = {
          title: `${data?.title} - ${data?.price}€`,
          text: `Check out this ${data?.title} for ${data?.price}€`,
          url: window.location.href
        };
    
        try {
          if (navigator.share) {
            await navigator.share(shareData);
          } else {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!', {
              position: 'bottom-center',
              autoClose: 2000
            });
          }
        } catch (err) {
          toast.error('Sharing failed. Please try again.', {
            position: 'bottom-center',
            autoClose: 2000
          });
        }
      };
      const isSaved = savedPostsData?.some((saved) => saved.post_id === data?.post_id);

  return (
<div className='flex flex-col'>
<div className='flex flex-row justify-between items-center w-full px-4'>
    <div className='flex flex-row items-center gap-4'>
        <ChevronLeft size={24} className='hover:text-red-500 cursor-pointer' onClick={()=>navigate(-1)}/>
        <h2 className='text-3xl font-bold'>{data?.title}</h2>
    </div>
    <div className='flex items-center gap-5 cursor-pointer'>
        <div className='flex items-center gap-1'onClick={async(e)=>{
        e.preventDefault();
        try{
        const saved = await savePost(data?.post_id).unwrap();
        console.log('Car saved successfully');
        }catch(err){
        console.error('Failed to save post:', err);}
        }}>
        <Heart size={20} className='text-red-500' fill={isSaved ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 0)'}/>
        <p className='text-red-500 underline underline-offset-4 hover:no-underline'>Favorites</p>
        </div>
        <div className='flex items-center gap-1 cursor-pointer' onClick={handleShare}>
        <Share size={20} className='text-red-500'/>
        <p className='text-red-500 underline underline-offset-4 hover:no-underline'>
          Share
        </p>
      </div>
    </div>
</div>

<div className='flex flex-row px-14 mt-4 gap-4'>
    <div className='flex flex-row items-center gap-1'>
        <ChartNoAxesGantt className='size-6'/>
        <p className='text-sm font-semibold '>{data?.mileage} km</p>
    </div>

    <div className='flex flex-row items-center gap-1'>
        <Calendar className='size-6'/>
        <p className='text-sm font-semibold '>{data?.year}</p>
    </div>

    <div className='flex flex-row items-center gap-1'>
        <Car className='size-6'/>
        <p className='text-sm font-semibold '>{data?.engine_power} hp</p>
    </div>

    <div className='flex flex-row items-center gap-1'>
        <Settings2 className='size-5'/>
        <p className='text-sm font-semibold '>{data?.transmission}</p>
    </div>

    <div className='flex flex-row items-center gap-1'>
        <Fuel className='size-5'/>
        <p className='text-sm font-semibold '>{data?.fuel}</p>
    </div>

    <div className='flex flex-row items-center gap-1'>
        <LifeBuoy className='size-5'/>
        <p className='text-sm font-semibold '>{data?.traction}</p>
    </div>

</div>
</div>
  )
}

export default CarHeader;
