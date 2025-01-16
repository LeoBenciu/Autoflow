import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const carSearchApi = createApi({
    reducerPath: 'carSearchApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000',
        credentials: 'include',
        prepareHeaders: (headers)=>{
            headers.set('Accept', 'application/json');
            return headers;
        }}),
    endpoints: (builder)=>({
        searchCars: builder.query({
            query: (searchParams)=>{
                const queryParams = new URLSearchParams();

                queryParams.append('page', searchParams.page || '1');
                queryParams.append('limit', '20');
                
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
                    queryParams.append('body', searchParams.body);
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
        }),
        signup: builder.mutation({
            query:(credentials)=>(
                {
                    url: `/users/signup`,
                    method: 'POST',
                    body: credentials
                }
            ),
            transformErrorResponse: (response) => {
                if (response.status === 'PARSING_ERROR') {
                    return {
                        data: {
                            errors: [{
                                path: 'email',
                                msg: response.data
                            }]
                        }
                    };
                }

                if (response.status === 500 && response.data?.details?.includes('chk_phone')) {
                    return {
                        data: {
                            errors: [{
                                path: 'phone',
                                msg: 'Invalid phone number format. Please use a valid international format (e.g., +1234567890)'
                            }]
                        }
                    };
                }
                
                return response;
            },
        }),
        login: builder.mutation({
            query:(credentials)=>({
                url: `/users/login`,
                method: 'POST',
                body: credentials
            }),
            transformResponse: (response) => {
                console.log('Raw login response:', response);
                return response.user;
            },
            transformErrorResponse: (response) => {
                if (response.status === 'PARSING_ERROR') {
                    return {
                        data: {
                            errors: [{
                                path: 'general',
                                msg: response.data
                            }]
                        }
                    };
                }
                return response
            }
        }),

        logout: builder.mutation({
            query: () => ({
                url: '/users/logout',
                method: 'POST'
            })
        }),

        googleLogin: builder.mutation({
            query: ()=>({
                url: '/users/auth/google',
                method: 'GET',
                credentials: 'include'
            })
        }),
        
        getUserDetails: builder.query({
            query: ()=>({
                url: '/users/settings/my-account',
                method: 'GET'
            })
        }),

        changeUserDetails: builder.mutation({
            query:(credentials)=>({
                url: '/users/settings/my-account',
                method: 'PUT',
                body: credentials
            })
        }),

        deleteAccount: builder.mutation({
            query:()=>({
                url: '/users/settings/my-account',
                method: 'DELETE'
            })
        }),

        changeUserLocationDetails: builder.mutation({
            query:(data)=>({
                url: '/users/settings/my-account/location',
                method: 'PUT',
                body: data
            })
        }),

    })
});

export const {useSearchCarsQuery, useSignupMutation, useLoginMutation,
    useCheckAuthQuery,useLogoutMutation, useGetUserDetailsQuery, useChangeUserDetailsMutation, 
    useChangeUserLocationDetailsMutation, useDeleteAccountMutation} = carSearchApi;