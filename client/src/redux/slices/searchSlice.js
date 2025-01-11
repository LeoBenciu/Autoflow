import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filters: {
        brand: '',
        model: '',
        minYear: null,
        maxYear: null,
        minPrice: null,
        maxPrice: null,
        transmission: '',
        fuel: '',
        mileage: null,
        traction: '',
        minEngineSize: null,
        maxEngineSize: null,
        minEnginePower: null,
        maxEnginePower: null,
        exteriorColor: '',
        interiorColor: '',
        body: '',
        city: '',
        state: '',
        country: ''
        },
    results: [],
    status: 'idle',
    error: null
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchParameters:(state,action)=>{
            state.filters = action.payload;
        },
        resetSearch:(state)=>{
            return initialState;
        },
        setResults:(state,action)=>{
            state.results = action.payload;
        }
    }
})

export const {setSearchParameters, resetSearch, setResults} = searchSlice.actions;
export default searchSlice.reducer;