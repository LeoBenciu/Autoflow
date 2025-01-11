import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const carSearchApi = createApi({
    reducerPath: 'carSearchApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000'}),
    endpoints: (builder)=>({
        searchCars: builder.query({
            query: (searchParams)=>{
                const queryParams = new URLSearchParams();
                
                if(searchParams.brand){
                    queryParams.append('brand', searchParams.brand);
                };

                if(searchParams.model){
                    queryParams.append('model',searchParams.model);
                };

                if(searchParams.price_from){
                    queryParams.append('price_from',searchParams.price_from);
                };

                if(searchParams.price_to){
                    queryParams.append('price_to',searchParams.price_to);
                };

                if(searchParams.year_from){
                    queryParams.append('year_from',searchParams.year_from);
                };

                if(searchParams.year_to){
                    queryParams.append('year_to', searchParams.year_to);
                };

                if(searchParams.mileage){
                    queryParams.append('mileage', searchParams.mileage);
                };

                if(searchParams.fuel){
                    queryParams.append('fuel', searchParams.fuel);
                };

                if(searchParams.traction){
                    queryParams.append('traction', searchParams.traction);
                };

                if(searchParams.engine_size_from){
                    queryParams.append('engine_size_from', searchParams.engine_size_from);
                };

                if(searchParams.engine_size_to){
                    queryParams.append('engine_size_to', searchParams.engine_size_to);
                };

                if(searchParams.engine_power_from){
                    queryParams.append('engine_power_from', searchParams.engine_power_from);
                };

                if(searchParams.engine_power_to){
                    queryParams.append('engine_power_to', searchParams.engine_power_to);
                };

                if(searchParams.transmission){
                    queryParams.append('transmission', searchParams.transmission);
                };

                if(searchParams.color){
                    queryParams.append('color', searchParams.color);
                };

                if(searchParams.interior_color){
                    queryParams.append('interior_color', searchParams.interior_color);
                };

                if(searchParams.body){
                    queryParams.append('state', searchParams.body);
                };

                if(searchParams.country){
                    queryParams.append('country', searchParams.country);
                };
                
                if(searchParams.state){
                    queryParams.append('state', searchParams.state);
                };

                return {
                    url: `/cars?${queryParams.toString()}`,
                    method: 'GET'
                }
            }
        })
    })
});

export const {useSearchCarsQuery} = carSearchApi;