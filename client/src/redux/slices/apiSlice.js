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
            tagTypes: ['MyPosts', 'SavedPosts'],
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

            forgotPassword: builder.mutation({
                query:(email)=>({
                    url: '/users/forgot-password',
                    method: 'POST',
                    body: email
                })
            }),

            resetPassword: builder.mutation({
                query:({token, newPassword})=>({
                    url: '/users/reset-password',
                    method: 'POST',
                    body: {token,newPassword}
                })
            }),

            getSavedPosts: builder.query({
                query:()=>({
                    url:'/saved',
                    method: 'GET'
                }),
                providesTags: ['SavedPosts'],
            }),

            savePost: builder.mutation({
                query:(postId)=>({
                    url: '/saved',
                    method: 'POST',
                    body: { post_id: postId }
                }),
                invalidatesTags: ['SavedPosts'],
            }),

            getMyPosts: builder.query({
                query: ()=>({ url: 'cars/my-posts', method: 'GET' }),
                providesTags: (result) =>
                    result
                        ? [
                            ...result.map(({ car_id }) => ({ type: 'MyPosts', id: car_id })),
                            { type: 'MyPosts', id: 'LIST' },
                        ]
                        : [{ type: 'MyPosts', id: 'LIST' }],
            }),
            
            getMyPost: builder.query({
                query:(carId)=>({
                    url: `/cars/my-posts/${carId}`,
                    method: 'GET'
                }),
                transformResponse: (response) => response
            }),

            createPost: builder.mutation({
                query:(formData)=>({
                    url: '/cars',
                    method: 'POST',
                    body: formData
                })
            }),

            deletePost: builder.mutation({
                query:(id)=>({
                    url: `/cars/${id}`,
                    method: 'DELETE'
                }),
                invalidatesTags: (result, error, id) => [{ type: 'MyPosts', id }, { type: 'MyPosts', id: 'LIST' }],
            }),

            migrateImages: builder.mutation({
                query: ({ oldPostId, newPostId }) => ({
                url: `cars/migrate-images/${oldPostId}/${newPostId}`,
                method: 'POST',
                responseHandler: (response) => response.text()
                }),
                transformResponse: (response) => {
                try {
                    return JSON.parse(response);
                } catch {
                    return { success: true };
                }
                },
                invalidatesTags: ['Post']
            }),

            getCarPost: builder.query({
                query: (id)=>({
                    url: `/cars/${id}`,
                    method: 'GET'
                }),
                transformResponse: (response)=>response
            }),
            
            getBuyConversations: builder.query({
                query: () => ({
                url: '/conversations/buy',
                method: 'GET'
                }),
                providesTags: ['Conversations']
            }),
        
            getSellConversations: builder.query({
                query: () => ({
                url: '/conversations/sell',
                method: 'GET'
                }),
                providesTags: ['Conversations']
            }),
        
            createConversation: builder.mutation({
                query: (conversationData) => ({
                url: '/conversations',
                method: 'POST',
                body: conversationData
                }),
                invalidatesTags: ['Conversations']
            }),
        
            getConversationMessages: builder.query({
                query: (conversationId) => ({
                url: `/conversations/${conversationId}/messages`,
                method: 'GET'
                }),
                providesTags: (result, error, conversationId) => 
                result ? [{ type: 'Messages', id: conversationId }] : []
            }),
        
            deleteConversation: builder.mutation({
                query: (conversationId) => ({
                url: `/conversations/${conversationId}`,
                method: 'DELETE'
                }),
                invalidatesTags: ['Conversations']
            }),

            getPostDataForConversation: builder.query({
                query:(id)=>({
                    url: `/cars/conversation-post/${id}`,
                    method:'GET'
                }),
                transformResponse: (response)=>response
            })
    })
    });

    export const {useSearchCarsQuery, useSignupMutation, useLoginMutation,
        useCheckAuthQuery,useLogoutMutation, useGetUserDetailsQuery, useChangeUserDetailsMutation, 
        useChangeUserLocationDetailsMutation, useDeleteAccountMutation, useForgotPasswordMutation,
    useResetPasswordMutation, useSavePostMutation, useGetSavedPostsQuery, useGetMyPostsQuery,
    useCreatePostMutation, useDeletePostMutation,useGetMyPostQuery,useEditPostMutation,
    useMigrateImagesMutation, useGetCarPostQuery, useGetBuyConversationsQuery, useGetSellConversationsQuery, useGetConversationMessagesQuery,
 useDeleteConversationMutation, useCreateConversationMutation} = carSearchApi;