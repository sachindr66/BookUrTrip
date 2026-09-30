import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const authenticateInsurance= createAsyncThunk(
    "insurance/authenticateInsurance",
    async(__, {rejectWithValue})=>{
        try {
            const response= await axios.post(`${import.meta.env.VITE_API_URL}/authenticates`)
            console.log("auth data", response.data)
            return response.data.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Authentication failed")
            
        }
    }
)

export const insuranceSearch = createAsyncThunk(
  "insurance/insuranceSearch",
  async (searchData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/insuranceSearch`,
        searchData
      );

      console.log("✅ Insurance Search:", response.data);

      return response.data;

    } catch (error) {
      console.error(
        "❌ Insurance Search API Error:",
        error.response?.data
      );

      return rejectWithValue(
        error.response?.data?.message ||  "Insurance search failed"
      );
    }
  }
);

const insuranceSlice = createSlice({
    name:"insurance",
    initialState:{
        tokenId:null,
        searchResults: [],
        error:null,
        status:"idle",
    },
    reducers:{ },

       extraReducers:(builder)=>{
        builder

        //authenticate
        .addCase(authenticateInsurance.pending, (state)=>{
            state.status  = "authloading"
            state.error = null
        })
        .addCase(authenticateInsurance.fulfilled,(state, action)=>{
            state.status = "succeeded"
            state.tokenId = action.payload?.TokenId;
        })
            .addCase(authenticateInsurance.rejected,(state, action)=>{
            state.status = "failed"
            state.error= action.payload
        })

        // insuraceSearch

        .addCase(insuranceSearch.pending,(state)=>{
            state.status ="searchloading",
            state.error=null
            console.log("insurance search loading")
       })

        .addCase(insuranceSearch.fulfilled,(state, action)=>{
            state.status ="succeeded";
            state.searchResults  = action.payload
            console.log("insurance search successful", action.payload)
       })

          .addCase(insuranceSearch.rejected,(state, action)=>{
            state.status ="failed";
            state.error = action.payload
            console.log("insurance search failed")
       })
        
    }
 
})


export default insuranceSlice.reducer