import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import sportcar from '../assets/sportscar.svg'
import familycar from '../assets/familycar1.svg'
import estate from '../assets/estate1.svg'
import citycar from '../assets/papa.svg'
import luxurycar from '../assets/luxurycar.svg'
import suvcar from '../assets/suvcar1.svg'

// Define your carousel items
const carouselItems = [
  {
    img: <img src={suvcar} alt="Sport Car" className="w-60 h-20 object-contain" />,
    title: "Suv"
  },
  {
    img: <img src={familycar} alt="Sport Car" className="w-60 h-20 object-contain" />,
    title: "Family Car"
  },
  {
    img: <img src={citycar} alt="Sport Car" className="w-60 h-20 object-contain" />,
    title: "City"
  },
  {
    img: <img src={luxurycar} alt="Sport Car" className="w-60 h-20 object-contain" />,
    title: "Luxury"
  },
  {
    img: <img src={estate} alt="Sport Car" className="w-60 h-20 object-contain" />,
    title: "Estate"
  },
  {
    img: <img src={sportcar} alt="Sport Car" className="w-60 h-30 object-contain" />,
    title: "Sport"
  }
]

export function HeroCarousel() {
  return (
    <Carousel className="w-full max-w-xl">
      <CarouselContent className="-ml-1">
        {carouselItems.map((item, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3 min-w-[215px] min-h-[168px] cursor-pointer">
            <div className="p-1">
              <Card>
                <CardContent className="flex flex-col aspect-square items-center justify-center p-6 gap-2">
                  {item.img}
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
