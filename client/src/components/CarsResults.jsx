import React from 'react'
const cars = [
    {
        title:  'Mercedes-Benz C 200 d T 120 kW',
        mileage: 48000,
        year: 2022,
        engine_power: 163,
        transmission: 'Automatic',
        fuel: 'Diesel',
        price: 30499,
        location: 'Germany'
    },
    {
        title:'Renault Scenic E-Tech Electric 220 Long Range Esprit 160 kW',
        mileage: 10,
        year: 2024,
        engine_power: 218,
        transmission: 'Automatic',
        fuel: 'Electric',
        price: 55299,
        location: 'Bulgaria'
    },
    {
        title:'Renault Megane E-Tech 160 kW',
        mileage: 5,
        year: 2024,
        engine_power: 218,
        transmission: 'Automatic',
        fuel: 'Electric',
        price: 46099,
        location: 'Austria'
    },
    {
        title: 'Fiat 500 1.0 51 kW',
        mileage: 41900,
        year: 2020,
        engine_power: 69,
        transmission: 'Manual',
        fuel: 'Petrol',
        price: 12000,
        location: 'France'
    },
    {
        title: 'Peugeot 3008 133 kW',
        mileage: 45,
        year: 2019,
        engine_power: 181,
        transmission: 'Automatic',
        fuel: 'Petrol',
        price: '25666',
        location: 'Germany'
    },
    {
        title: 'Jeep Compass 1.3 Turbo PHEV 140 kW',
        mileage: 31199,
        year: 2021,
        engine_power: 190,
        transmission: 'Manual',
        fuel: 'Hybrid',
        price: 26699,
        location: 'England'
    }
]

const CarsResults = () => {
  return (
    <div className='flex flex-col min-w-full min-h-max'>
      {cars.map((car)=>{
        return(
            <div className='rounded-lg min-w-full min-h-56 bg-red-500 my-2 flex flex-row'>
                <img src={car.image}></img>
            </div>
        )
      })}
    </div>
  )
}

export default CarsResults
