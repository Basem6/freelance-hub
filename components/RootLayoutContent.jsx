'use client'

import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { Navbar } from './landing/navbar'

import { setUser } from '../app/lib/Features/authSlice'
import api from '../app/utils/api'
import { useAppDispatch, useAppSelector } from '@/app/lib/hooks'

export default function RootLayoutContent({ children }) {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    
    useEffect(() => {
        // استعد البيانات من localStorage عند التحميل
        if (typeof window !== 'undefined') {
            const savedUser = localStorage.getItem('user')
            if (savedUser) {
                try {
                    const user = JSON.parse(savedUser)
                    dispatch(setUser(user))
                } catch (error) {
                    console.error('Failed to restore user', error)
                }
            }
        }

        // تحقق من الـ Server
        const checkAuth = async () => {
            try {
                const res = await api.get('/api/auth/me')
                if (res.data.success) {
                    dispatch(setUser(res.data.user))
                }
            } catch (error) {
                console.log('Not authenticated')
            }
        }

        if (isAuthenticated) {
            checkAuth()
        }
    }, [dispatch, isAuthenticated])
    useEffect(() => {
    const getMe = async () => {
        try {
            const res = await api.get("/api/auth/me", {
                withCredentials: true,
            });
        } catch (err) {
            console.log("Not logged in");
        }
    };

    getMe();
}, []);
    return (
        <>
            <Navbar></Navbar>
            {children}
        </>
    )
}