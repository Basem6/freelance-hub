import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
            state.error = null
            
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(action.payload))
            }
        },
        updateUser(state, action) {
        if (!state.user) return;
        
        state.user = {
        ...state.user,
        ...action.payload, // ✅ دمج البيانات
        };
        if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(state.user));
        }
    },
            
        
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.error = null
            
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user')
            }
        },
        setError: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { setUser, logout, setError, setLoading , updateUser } = authSlice.actions
export default authSlice.reducer