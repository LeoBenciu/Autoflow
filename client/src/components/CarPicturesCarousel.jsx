import React, { useState } from 'react'
import { X } from 'lucide-react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import car from '../assets/carmodel.jpg'
import corvette from '../assets/corvette.png'

const images = [
    {src: car},
    {src: car},
    {src: corvette},
    {src: car},
    {src: car}
]

const CarPicturesCarousel = () => {

    const [isImageFull, setImageFull]= useState('');

  return (
    <div className='mt-8'>
      <Carousel>
      <CarouselContent>
        {images.map((image)=>(
                <CarouselItem className="basis-1/2">
                    <img src={image.src} className='w-[45rem] h-[30rem] object-cover rounded-lg' onClick={()=>setImageFull(image.src)}/>
                </CarouselItem>
        ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

    {isImageFull.length > 1 &&(
      <div className='flex flex-col fixed inset-0 z-50 bg-black/80 top-0 left-0 items-center py-5' onClick={()=>setImageFull('')}>
        <div className='flex flex-row min-w-full px-5'>
            <X size={35} className='text-red-500 cursor-pointer' onClick={()=>setImageFull('')}/>
        </div>
        <img src={isImageFull} className='min-h-[50rem] max-w-[90%] object-cover rounded-lg'></img>
      </div>
    )}
    </div>
  )
}

export default CarPicturesCarousel;
