import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API } from "../../api/authApi"
import axios from "axios";


export const registerUser = createAsyncThunk(

    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {

            const response = await API.post("/register", userData);
            console.log(response.data)
            return response.data

        } catch (error) {
            return rejectWithValue(
                error.response?.data.error || "Register Failed"
            )
        }
    }

)

export const loginUser = createAsyncThunk(
    "auth/login",

    async (userData, { rejectWithValue }) => {

        try {
            const response = await API.post("/login", userData, {
                withCredentials: true,
            })
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error)


            return rejectWithValue(
                error.response?.data?.error || "Login Failed"
            )


        }
    })


export const fetchProfile = createAsyncThunk(
    "auth/profile",

    async (_, { rejectWithValue }) => {

        try {

            const response = await API.get("/profile")
            return response.data.user


        } catch (error) {
            return rejectWithValue(error.response.data)

        }
    }
)

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.post("/logout", {}, { withCredentials: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Logout Failed");
    }
  }
)

export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (emailData, { rejectWithValue }) => { 
        try {
            const response = await API.post("/forgot-password", emailData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || "Forgot Password Failed"
            );
        }
    }
);

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await API.post("/reset-password", passwordData);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.error || "Reset Password Failed"
            );
        }   
    }
);


const initialState = {
    user: null,
    loading: false,
    error: null,
    message: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },

        logoutSuccess(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    },
    extraReducers: (builder) => {
        builder

            //Register

            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.user = action.payload.user
                state.message = action.payload.message
                state.error = null
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
                state.isAuthenticated = false
            })

            //Login

            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.user = action.payload.user || null
                state.message = action.payload.message
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false
                state.user = null
                state.isAuthenticated = false
                state.message = null
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

        //featch profile

        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchProfile.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
            });

        // forgot password
        builder
            .addCase(forgotPassword.pending, (state) => {       
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // reset password
        builder
            .addCase(resetPassword.pending, (state) => {        
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    }

})


export const { clearError, logoutSuccess } = authSlice.actions
export default authSlice.reducer


